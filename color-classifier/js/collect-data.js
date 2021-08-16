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
let container, btnContainer, rgbP;

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
    container = select("#container");
    btnContainer = select("#btn-container");
    rgbP = select("#RGB");
    let cnv = createCanvas(480, 480);
    cnv.parent(container);
    pickColor();
    createBtns(data);
}

function pickColor() {
    let r = floor(random(0, 255));
    let g = floor(random(0, 255));
    let b = floor(random(0, 255));
    background(r, g, b);
    rgbP.html(`R:${r}    G:${g}    B:${b}`);

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
        btn.parent(btnContainer);
        btn.mousePressed(() => {
            data.color = color;
            sendData();
        });
        btns.push(btn);
    }
}
