function preload() {
    readData();
}

function setup() {}

function readData() {
    var db = app.database();
    db.collection("color-classifier")
        .get()
        .then((res) => {
            console.log(res.data);
        });
}
