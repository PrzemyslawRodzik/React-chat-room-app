import sha1 from "js-sha1";

const IsPasswordPwnedAsync = async (password) => {
  if (password === "") {
    return -1;
  }

  let sha1hash = sha1(password);

  let hashFirstFive = sha1hash.substring(0, 5);
  let hashLeftover = sha1hash.substring(5);
  console.log(hashFirstFive + ":" + hashLeftover);

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${hashFirstFive}`
  );
  const hashes = await response.text();

  return ReduceResult(sha1hash, hashes);
};

const ReduceResult = (hashToFind, listOfHashes) => {
  let hashes = listOfHashes.split("\n");

  let first5 = hashToFind.substring(0, 5);

  //let found = hashes.FirstOrDefault(h => $"{first5}{h}".Contains(hashToFind));
  let found = hashes.filter((hash) =>
    first5.concat(hash).toUpperCase().includes(hashToFind.toUpperCase())
  );
  found = found + "";
  found = found.split(":")[1];
  if (typeof found === "undefined") {
    return -1;
  }

  return found;
};
export default IsPasswordPwnedAsync;
