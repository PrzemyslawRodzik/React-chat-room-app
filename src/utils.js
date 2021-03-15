export const numberWithSpaces = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const formattedCreatedAt = (field) => {
  const time = field?.toDate().toLocaleTimeString();
  return time + " | " + field?.toDate().toDateString();
};
