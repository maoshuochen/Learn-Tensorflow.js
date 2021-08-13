const colorName = [
    "red",
    "green",
    "blue",
    "orange",
    "yellow",
    "pink",
    "purple",
    "brown",
];
let model;
let modelReady;
let r, g, b;
let rSlider, gSlider, bSlider;

async function setup() {
    rSlider = createSlider(0, 255);
    gSlider = createSlider(0, 255);
    bSlider = createSlider(0, 255);
    resultP = createP("waiting for training");
    let data = await readData();
    let trainSet = handleData(data);
    await train(trainSet.xs, trainSet.ys, 0.7, 100);
}

async function draw() {
    createCanvas(320, 320);
    r = rSlider.value();
    g = gSlider.value();
    b = bSlider.value();
    background(r, g, b);
    if (modelReady) {
        result = await predict(r, g, b);
        resultP.html(colorName[result]);
    }
}

async function readData() {
    // Login
    const auth = app.auth();
    async function login() {
        await auth.anonymousAuthProvider().signIn();
        const loginState = await auth.getLoginState();
        console.log("Login state: " + loginState.isAnonymousAuth); // true
    }
    await login();
    // Read Data
    var db = app.database();
    let data;
    await db
        .collection("color-classifier")
        .get()
        .then((res) => {
            // console.log(res.data);
            data = res.data;
        });
    return data;
}

function handleData(data) {
    let xs = [];
    let ys = [];
    for (let item of data) {
        xs.push([item.r / 255, item.g / 255, item.b / 255]);
        ys.push(colorName.indexOf(item.color));
    }
    xs = tf.tensor(xs);
    ys = tf.tensor1d(ys, "int32");
    ys = tf.oneHot(ys, 8);
    return { xs, ys };
}

//Model
async function train(xs, ys, learningRate, epochs) {
    model = await initModel(learningRate, true);
    //Train
    const fitOptions = {
        epochs: epochs,
        shuffle: true,
        validationSplit: 0.1,
        callbacks: {
            onTrainBegin: () => console.log("Train Begin!"),
            onTrainEnd: () => console.log("Train End!"),
            onEpochEnd: (epoch, logs) =>
                console.log(`Epoch:${epoch}, Loss:${logs.loss}`),
        },
    };
    await model.fit(xs, ys, fitOptions);
    modelReady = true;
}

async function predict(r, g, b) {
    let input = tf.tensor([r / 255, g / 255, b / 255], [1, 3]);
    //Predict
    const prediction = await model.predict(input);
    const result = await prediction.argMax(1).array();
    return result[0];
}

function initModel(learningRate, summary) {
    const model = tf.sequential({
        layers: [
            tf.layers.dense({
                units: 4,
                inputShape: [3],
                activation: "relu",
            }), //Input Layer
            tf.layers.dense({
                units: 8,
                activation: "softmax",
            }), //Hidden Layer
        ],
    });
    model.compile({
        optimizer: tf.train.adam(learningRate), //Learning Rate
        loss: tf.losses.softmaxCrossEntropy,
    });
    if (summary) {
        model.summary();
    }
    return model;
}
