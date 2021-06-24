export const formatName = (name: string): string => {
  const nameArr = name.split(" ");
  let newName = "";

  nameArr.forEach((v, i) => {
    if (i < 2) {
      newName += v + " ";
    } else {
      newName += v.charAt(0) + ". ";
    }
  });

  return newName;
};

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
