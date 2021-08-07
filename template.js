main(0.8, 100);

async function main(learningRate, epochs) {
    const trainSet = {
        xs: tf.tensor([
            [1, 1],
            [0.5, 0.5],
            [0, 0],
        ]),
        ys: tf.tensor([
            [0, 0, 0],
            [0.5, 0.5, 0.5],
            [1, 1, 1],
        ]),
    };
    const model = initModel(learningRate, true);
    await trainModel(epochs, trainSet.xs, trainSet.ys, model);
    const prediction = model.predict(tf.tensor([0.2, 0.2], [1, 2]));
    prediction.print();
}

function initModel(learningRate, summary) {
    const model = tf.sequential({
        layers: [
            tf.layers.dense({ units: 4, inputShape: [2] }), //Input Layer
            tf.layers.dense({ units: 3 }), //Hidden Layer
        ],
    });
    model.compile({
        optimizer: tf.train.sgd(learningRate), //Learning Rate
        loss: tf.losses.meanSquaredError,
    });
    if (summary) {
        model.summary();
    }
    return model;
}

async function trainModel(epochs, xs, ys, model) {
    console.log("--------------Start Training!----------------");
    for (let i = 0; i < epochs; i++) {
        const response = await model.fit(xs, ys);
        console.log(`Epoch: ${i + 1}, Loss: ${response.history.loss[0]}`);
    }
    console.log("--------------Complete Training!----------------");
}
