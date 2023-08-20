import { readdirSync } from "fs";
import Excel from "exceljs";
import axios from "axios";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as stream from "stream";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const XLSX_DIR = "./xlsx";
const XLSX_WORKSHEET_NAME = "carros";
const CARS = [];
const ALL_INFO_CARS = [];

// entrar encontrar o último arquivo xlsx gerado na pasta xlsx
const getLastXLSX = () => {
  const filesNames = readdirSync(XLSX_DIR);
  let moreRecentFile = filesNames[0];
  filesNames?.forEach((fileName) => {
    if (
      Number(fileName?.split(".")[0]) > Number(moreRecentFile?.split(".")[0])
    ) {
      moreRecentFile = fileName;
    }
  });
  return `${XLSX_DIR}/${moreRecentFile}`;
};

// intera sobre o XLSX para obter a lista de carros dentro do XLSX
const getCARSFromXLSX = async () => {
  const workbook = new Excel.Workbook();
  await workbook?.xlsx?.readFile(getLastXLSX());
  const worksheet = workbook?.getWorksheet(XLSX_WORKSHEET_NAME);

  worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
    const r = worksheet.getRow(rowNumber);
    const id = r.getCell(1).value;
    const nome = r.getCell(2).value;
    const categoria = r.getCell(3).value;
    const garagem = r.getCell(4).value;
    const capacidade = r.getCell(5).value;
    const imageUrl = r.getCell(7).value;
    const imagePath = r.getCell(8).value;

    CARS?.push({
      nome,
      id,
      categoria,
      garagem,
      capacidade,
      imageUrl,
      imagePath,
      baixado: !!imagePath,
    });
  });
};

// responsável por baixar a imagem dos carros
const downloadImage = async (imageUrl, vehicleName) => {
  if (!imageUrl) {
    return "";
  }
  const localFilePath = path.join(__dirname, "images", `${vehicleName}.png`);

  const writer = fs.createWriteStream(localFilePath);

  const finished = promisify(stream.finished);

  await axios({
    method: "get",
    url: imageUrl,
    responseType: "stream",
  })
    .then((response) => {
      console.log("BAIXOU A FOTO DÊ", vehicleName);
      response.data.pipe(writer);
      return finished(writer);
    })
    .catch((error) => {
      console.error("Error downloading image:", error);
    });

  return localFilePath;
};

// itera sobre o array original buscando mais informações dos carros e
// cria um array secundário com os carros e suas informações adicionais
const getMoreInfoCars = async () => {
  await getCARSFromXLSX();

  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--disable-notifications"],
  });

  const page = await browser.newPage();

  for (let i = 0; i < CARS?.length; i++) {
    if (CARS[i]?.baixado) {
      ALL_INFO_CARS?.push({
        ...CARS[i],
      });
      continue;
    }

    const queryString = encodeURIComponent(CARS[i]?.nome);

    await page.goto(`https://gta.fandom.com/wiki/${queryString}`, {
      waitUntil: "load",
      timeout: 0,
    });

    let parsed = await page.evaluate(() => {
      const categoria =
        document.querySelectorAll(
          '[title*="Displayed on the HUD in GTA V and/or GTA Online."]'
        )[0]?.parentNode?.parentNode?.children[1]?.textContent || "";

      const capacidade =
        document?.querySelectorAll(`[data-source="capacity"]`)[0]?.children[1]
          ?.textContent || "";

      const imageUrl =
        document?.querySelectorAll('[class="pi-image-thumbnail"]')[1]
          ?.attributes?.src?.textContent || "";

      return {
        categoria,
        capacidade,
        imageUrl,
      };
    });

    const imagePath = await downloadImage(parsed?.imageUrl, CARS[i]?.nome);

    ALL_INFO_CARS?.push({
      ...parsed,
      id: CARS[i]?.id,
      nome: CARS[i]?.nome,
      imagePath,
      baixado: !!imagePath,
    });
    continue;
  }
  await browser.close();

  return;
};

const exportXLSXWithCARS = async () => {
  await getMoreInfoCars();

  const workbook = new Excel.Workbook();
  await workbook?.xlsx?.readFile(getLastXLSX());
  const worksheet = workbook?.getWorksheet(XLSX_WORKSHEET_NAME);

  worksheet.columns = [
    { header: "id", key: "id", width: 10 },
    {
      header: "Nome",
      key: "nome",
      width: 30,
    },
    {
      header: "Categoria",
      key: "categoria",
      width: 30,
    },
    {
      header: "Garagem",
      key: "garagem",
      width: 30,
    },
    {
      header: "Quantidade Pessoas",
      key: "quantidadePessoas",
      width: 60,
    },
    {
      header: "Foto",
      key: "foto",
      width: 30,
    },
    {
      header: "imageUrl",
      key: "imageUrl",
      width: 30,
    },
    {
      header: "imagePath",
      key: "imagePath",
      width: 30,
    },
  ];
  worksheet.rows;

  worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
    row.height = 50;
    const id = row.getCell(1).value;
    const car = ALL_INFO_CARS?.find((e) => String(e?.id) === String(id));
    const photoAlreadyExists = !!row.getCell(8).value;

    row.getCell(3).value = car?.categoria || "";
    row.getCell(5).value = car?.capacidade || "";
    row.getCell(7).value = car?.imageUrl || "";
    row.getCell(8).value = car?.imagePath || "";

    if (!car?.imagePath) return;

    if (photoAlreadyExists) return;

    try {
      const imageBuffer = fs.readFileSync(car?.imagePath);
      const base64Image = imageBuffer.toString("base64");

      const image = workbook.addImage({
        base64: base64Image,
        extension: "png",
      });

      worksheet.addImage(image, {
        tl: { col: 5, row: rowNumber - 1 },
        ext: { width: 100, height: 57 },
      });
    } catch (error) {
      return;
    }
  });

  return workbook.xlsx.writeFile(`./xlsx/${new Date().getTime()}.xlsx`); //Change file name here or give
};

exportXLSXWithCARS();
