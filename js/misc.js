function zip(rows) {
  return rows[0].map((_, i) => rows.map(row => row[i]));
}

// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  return floor(random(min, max)); 
}

function getRandomItem(items) {
  let tot = 0;
  for(const e of items) {
    tot += e[1];
  }

  let x = random(tot);
  let sum = 0;
  for(const e of items) {
    sum += e[1];
    if (x < sum) return e[0];
  }
  return null;
}

function shuffle(arr) {
  for(let i = 1; i < arr.length; ++i) {
    let j = getRandomInt(0, i);
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}
