
let colorIndicator = document.getElementById("color-indicator");
const colorPicker = new iro.ColorPicker("#color-picker", {
    width: 200,
    color: "#f00",
});
colorPicker.on("color:change", function (color) {
    colorIndicator.style.backgroundColor = color.hexString;
});
