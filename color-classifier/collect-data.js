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
let data;

async function sendData() {
    // Login
    const auth = app.auth();
    async function login() {
        await auth.anonymousAuthProvider().signIn();
        const loginState = await auth.getLoginState();
        console.log(loginState.isAnonymousAuth); // true
    }
    await login();
    // Write data
    console.log(data);
    var db = app.database();
    db.collection("color-classifier")
        .add(data)
        .then((res) => {
            console.log(res);
        });
    // Refresh
    pickColor();
}

function setup() {
    let cnv = createCanvas(320, 320);
    cnv.parent("container");
    pickColor();
    createBtns(data);
}

function pickColor() {
    let r = floor(random(0, 255));
    let g = floor(random(0, 255));
    let b = floor(random(0, 255));
    background(r, g, b);

    data = {
        r: r,
        g: g,
        b: b,
    };
}

function createBtns() {
    let btns = [];
    for (let color of colorName) {
        let btn = createButton(color);
        btn.mousePressed(() => {
            data.color = color;
            sendData();
        });
        btns.push(btn);
    }
}
