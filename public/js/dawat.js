function copyText() {
    const copyText = document.getElementById("groupLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    
    document.execCommand("copy");
    alert("Copied text!");
}