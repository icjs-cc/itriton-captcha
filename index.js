const sharp = require("sharp");
const path = require("path");
const axios = require("axios");

const url = path.join(__dirname, "./images/default.jpeg");

const opts = {
  width: 270,
  height: 144,
  size: 30,
  url,
};

const create = async function (options) {
  options = Object.assign({}, opts, options);
  const { width, height, size, url } = options;
  let image = url;
  if (isUrl(url)) {
    const axiosData = await axios({ url, responseType: "arraybuffer" });
    image = axiosData.data;
  }
  const baseImage = await sharp(image).resize(width, height).png().toBuffer();
  const left = randomRangeNum(size, width - size);
  const top = randomRangeNum(size, height - size);
  const border = 1;

  // Generate Jigsaw Image
  const jigsawBaseImage = await sharp(baseImage)
    .extract({ left: 0, top: top, width: size, height: size })
    .extend({
      top: border,
      bottom: border,
      left: border,
      right: border,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  const jigsawImage = await sharp(jigsawBaseImage)
    .extend({
      top: top - border,
      bottom: height - top - size - border,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const jigsawWhiteImage = await sharp({
    create: {
      width: size + border,
      height: size + border,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0.5 },
    },
  })
    .png()
    .toBuffer();

  // Generate Background Image
  const backgroundImage = await sharp(baseImage)
    .composite([
      {
        input: jigsawWhiteImage,
        left: left,
        top: top,
      },
    ])
    .png()
    .toBuffer();

  return {
    backgroundImage: `data:image/jpg;base64,${backgroundImage.toString(
      "base64"
    )}`,
    jigsawImage: `data:image/jpg;base64,${jigsawImage.toString("base64")}`,
    x: left,
  };
};

function isUrl(url) {
  if (/^http|https:\/\/.*/i.test(url)) {
    return true;
  }
  return false;
}

function randomRangeNum(min, max) {
  const range = max - min;
  const random = Math.random();
  return min + Math.round(random * range);
}

module.exports.create = create;
