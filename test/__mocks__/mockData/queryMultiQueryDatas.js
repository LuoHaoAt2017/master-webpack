export function generateQueryDatas(num) {
  const Data = [];
  for (let i = 0; i < num; i += 1) {
    Data.push({
      Name: '1     ',
      ObjectId: '21beea84-015f-491d-a514-d690a0e6c75c',
    });
  }
  return Data;
}

function queryMultiQueryDatas(code, objectIds) {
  const length = objectIds.split(';').length;
  return generateQueryDatas(length - 1);
}

export default queryMultiQueryDatas;
