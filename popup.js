// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const backgrounds = [
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgetwallpapers.com%2Fwallpaper%2Ffull%2Fa%2F0%2F7%2F656116.jpg&f=1&nofb=1&ipt=6ef5e82ab7086d7cfa01b0e9b0a48716608e24d8e008bb1b333d112468aab63e&ipo=images',
        'https://images.unsplash.com/photo-1648851633100-cd8ae486646e?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ];
    let currentBackgroundIndex = 0;
    function changeBackground() {
        document.body.style.backgroundImage = `url(${backgrounds[currentBackgroundIndex]})`;
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    }
    changeBackground();
    document.body.addEventListener('mousemove', changeBackground);
    document.getElementById('convert').addEventListener('click', () => {
        console.log('Convert button clicked');
    });
});
