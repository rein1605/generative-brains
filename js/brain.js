zip = rows => rows[0].map((_, i) => rows.map(row => row[i]));

const AgingSpeed = [
  ['Year', 365.0 / 365.0],
  ['Month', 365.0 / 30],
  ['Week', 365.0 / 7],
];

/*
Cycle of 50 years:
- [0, 25): Growing
- [25, 40): Stable
- [40, 49): Decaying
- [49, 50): Dead
*/

const GROW_END = 25;
const STABLE_END = 40;
const DECAY_END = 49;
const CYCLE_END = 50;

class Brain {
  constructor(traits) {
    const modelObj = JSON.parse(modelRaw);
    const weights = base64ToFloatArray(weightsRaw);
    this.model = loadModel(modelObj, weights);
  
    this.stage = 0;
    this.birthDate = traits.birthDate;
    this.speed = AgingSpeed.filter(e => e[0] == traits.agingSpeed)[0][1];
  }

  updateAge(time) {
    const deltaTimestamp = time.getTime() - this.birthDate.getTime();
    const deltaYear = deltaTimestamp / (1000 * 60 * 60 * 24 * 365);
        
    const age = deltaYear * this.speed;
    const cycleTime = age - Math.floor(age / CYCLE_END) * CYCLE_END;

    let growth = 0;
    if (cycleTime < GROW_END) {
      growth = map(cycleTime, 0, GROW_END, 0, 1);
      this.stage = 0;
    } else if (cycleTime < STABLE_END) {
      growth = 1;
      this.stage = 1;
    } else if (cycleTime < DECAY_END) {
      growth = map(cycleTime, 0, GROW_END, 0, 1);
      this.stage = 2;
    } else {
      growth = 0;
      this.stage = 3;
    }

    const activityLevel = map(growth, 0, 1, 0.8, 1);
    this.model.updateNeurons(activityLevel);
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
  
    const result_tensor = this.model.forward(img_tensor);
    const result = result_tensor.mat[0];
   
    const classes = ['cryptoadz', 'cryptopunks', 'moonbirds', 'nouns'];
  
    const predictions = zip([result, classes]);
    
    return predictions;
  }  
}
