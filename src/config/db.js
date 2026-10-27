const fs = require('fs');
const path = require('path');

const getDataPath = (entity) => path.join(__dirname, `../../data/${entity}.json`);

const readData = (entity) => {
  try {
    const filePath = getDataPath(entity);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
};

const writeData = (entity, data) => {
  const filePath = getDataPath(entity);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = { readData, writeData };
