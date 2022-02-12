const randomString = () => {
  const characters = 8;
  let randomStr = "";

  for (let i = 0; i < characters; i++) {
    const random = Math.floor(Math.random() * 10 + 1);

    randomStr += random;
  }

  return randomStr;
};

module.exports = randomString;
