const csvTrainUrl = '../train.csv';
const csvTestUrl = '../test.csv';
 
async function run() {

    const csvTrainDataset = tf.data.csv(
      csvTrainUrl, {
      columnConfigs: {
       cat: {
          isLabel: true
        }
      }
    });

    const csvTestDataset = tf.data.csv(
      csvTestUrl, {
        columnConfigs: {
         cat: {
            isLabel: true
          }
        }
      });

    const trainData = await csvTrainDataset.toArray()
    const testData = await csvTestDataset.toArray()

    const numOfFeatures = (await csvTrainDataset.columnNames()).length - 1; 

    const X_train = tf.tensor(trainData.map(i=>Object.values(i.xs)))
    const Y_train = tf.tensor(trainData.map(i=>Object.values(i.ys)))
    const X_test  = tf.tensor(testData.map(i=>Object.values(i.xs)))
    const Y_test  = tf.tensor(testData.map(i=>Object.values(i.ys)))
    X_train.print()
    X_test.print()
    Y_train.print()
    const model = tf.sequential();
  
    model.add(tf.layers.dense({
      inputShape: [numOfFeatures],
      units: 2,
      activation : 'sigmoid' 
    }));

    model.add(tf.layers.dense({
      units: 1,
      activation : 'sigmoid'
    }));

    model.compile({
      optimizer: tf.train.adam(0.05),
      loss: 'meanSquaredError'
    });

    await model.fit(X_train,Y_train, {
      epochs: 100,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          console.log(epoch + ':' + logs.loss);
        }
      }
    });

    const ops =  model.predict(X_test).sub(0.5).step(0)
    const sum = await ops.equal(Y_test).sum().data()

    console.log(`Score : ${sum*100/ops.size}%`)
    console.log("Weights of Hidden Layer : " , model.layers[0].getWeights()[0].toString())
    console.log("Biases of Hidden Layer : " , model.layers[0].getWeights()[1].toString())
    console.log("Weights of Output Layer : " , model.layers[1].getWeights()[0].toString())
    console.log("Biases of Output Layer : " , model.layers[1].getWeights()[1].toString())
}

run() 