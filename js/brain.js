const AgingSpeed = [
  ['Year', 365.0 / 365.0],
  ['Month', 365.0 / 30],
  ['Week', 365.0 / 7],
];

/*
Cycle of 50 years:
- [0, 25): Growing
- [25, 50): Stable
- [50, 57): Decaying
- [57, 60): Dead
*/

// Shape: 1 - (1 - px)^n = py
function getGrowthFunc(px, py) {
  // Solving for n:
  // (1 - px)^n = 1 - py
  // n = log_{1 - px} (1 - py)
  // n = ln(1 - py) / ln(1 - px)
  const n = Math.log(1 - py) / Math.log(1 - px);
  console.log("n:", n);
  return x => 1 - Math.pow(1 - x, n);
}

const GROW_END = 25;
const STABLE_END = 50;
const CYCLE_END = 60;

class Brain {
  constructor(traits) {
    const modelObj = JSON.parse(modelRaw);
    const weights = base64ToFloatArray(weightsRaw);
    this.model = loadModel(modelObj, weights);
  
    this.iteration = 0;
    this.stage = 0;
    this.birthDate = traits.birthDate;
    this.speed = AgingSpeed.filter(e => e[0] == traits.agingSpeed)[0][1];
    this.growthFunc = getGrowthFunc(0.4, 0.8);
  }

  updateAge(time) {
    const deltaTimestamp = time.getTime() - this.birthDate.getTime();
    const deltaYear = deltaTimestamp / (1000 * 60 * 60 * 24 * 365);
    const age = deltaYear * this.speed;
    this.iteration = Math.floor(age / CYCLE_END);        
    const cycleTime = age - this.iteration * CYCLE_END;

    let growth = 0;
    if (cycleTime < GROW_END) {
      let x = map(cycleTime, 0, GROW_END, 0, 1);
      growth = this.growthFunc(x);
      this.stage = 0;
    } else if (cycleTime < STABLE_END) {
      growth = 1;
      this.stage = 1;
    } else if (cycleTime < CYCLE_END) {
      let x = map(cycleTime, STABLE_END, CYCLE_END, 0, 1);
      growth = map(x, 0, 1, 1, 0);
      this.stage = 2;
    }

    this.model.updateNeurons(growth);
  }

  getBrainStatus() {
    return {
      totalNeurons: this.model.getTotalNeurons(),
      activeNeurons: this.model.getActiveNeurons(),
      stage: this.stage,
    };
  }
  
  classifyImage(pixels) {
    const img_tensor = new Tensor(pixels, 1, pixels.length);
  
    const result_tensor = this.model.forward(img_tensor, this.iteration);
    const result = result_tensor.mat[0];
   
    const classes = ['cryptoadz', 'cryptopunks', 'moonbirds', 'nouns'];
  
    const predictions = zip([result, classes]);
    
    return predictions;
  }  
}
