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

async function setup() {
    let data = await readData();
    // Sort by Color Name
    data.sort((a, b) => {
        return colorName.indexOf(a.color) - colorName.indexOf(b.color);
    });
    console.log(data);
    // Draw
    noCanvas();
    let size = 60;
    let x = 0;
    let y = 0;
    let divs = [];
    let color_p = createP("color");
    let id_p = createP("user_id");
    let container = createDiv();
    container.style("display", "flex");

    for (let item of data) {
        let div = createDiv();
        div.parent(container);
        div.style("background-color", `rgb(${item.r},${item.g},${item.b})`);
        div.style("width", `${size}px`);
        div.style("height", `${size}px`);
        div.mouseOver(() => {
            id_p.html(item._openid);
            color_p.html(item.color);
            div.style("padding", `${size / 5}px`);
        });
        div.mouseOut(() => {
            div.style("padding", "0px");
        });
        divs.push(div);
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
