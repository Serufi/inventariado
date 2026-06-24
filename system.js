let table;
var vertical = true;
var id_last_zone_clicked = "";
var centring_target = "=grl9";
let isDirty = true;

//--------------------------------------- hovered stuff
document.addEventListener("mouseenter", e => {
    if (!e.target.tagName) return;
    if (e.target.tagName.toLowerCase() === "path") {
        var output_text = e.target.id;
        log(output_text);
        iluminate(e.target);
    }
    if (e.target.getAttribute("role")?.toLowerCase() === "row") {
        De_iluminate();
        const cell = e.target.querySelector("span.cell-value");
        if (cell) {
            const text_search = cell.textContent;
            const buscado = document.getElementById(text_search);
            if (buscado) { iluminate(buscado); }
        }
    }



    const el1 = document.getElementById('svg-pan-zoom-zoom-in');
    const el2 = document.getElementById('svg-pan-zoom-zoom-out');

    if (el1) {
        el1.setAttribute( 'transform',
            el1.getAttribute('transform').replace(/scale\([^)]+\)/, 'scale(0.02)')
        );
    }
    if (el2) {
        el2.setAttribute( 'transform',
            el2.getAttribute('transform').replace(/scale\([^)]+\)/, 'scale(0.02)')
        );
    }

}, true);

window.addEventListener("beforeunload", (event) => {
    if (isDirty) {
        event.preventDefault();
        event.returnValue = "";
    }
});

document.addEventListener("mouseleave", e => {
    if (!e.target.tagName) return;

    log("");
    if (e.target.tagName.toLowerCase() === "path") {
        De_iluminate();
    }
}, true);

document.addEventListener('mousemove', e => {
    const label = document.getElementById('follow_label');

    label.style.top  = (e.clientY - 40) + 'px';
    label.style.left = (e.clientX - 50) + 'px';
    // var r = (e.clientX + 15) + 'px';
    // var t = (e.clientY + 15) + 'px';
    // document.querySelector('.white_t').style.cssText = 'right:100px;top:50px;';
});

document.addEventListener("pointerdown", async e => {
    var output_text = "";
    if (e.target.tagName.toLowerCase() === "path") {
        try {
            output_text = e.target.id;
            id_last_zone_clicked = output_text;

            log("Copiado!  " + output_text);
            await navigator.clipboard.writeText(output_text);

            // Show tooltip on the element
            var originalTitle = e.target.getAttribute("title") || "";
            e.target.setAttribute("title", "✅ copiado!");

            setTimeout(() => {
                e.target.setAttribute("title", originalTitle);
            }, 3000);

            // Or create a toast notification
            showToast("Copiado: " + output_text);

            pasteFromClipboard();
        } catch (err) {
            console.error("Fallo al copiar: ", err);
        }
    }
}, true);


//------------------------------------------------------------- hovered stuff
async function pasteFromClipboard() {

    try {
        await navigator.clipboard.readText();
        console.log("Pasted text");
    } catch (err) {
        console.error("Failed to paste: ", err);
    }
}

function De_iluminate() {
    document.querySelectorAll(".hovered")
        .forEach(el => el.classList.remove("hovered"));
}

function markAsUnsaved() {
    isDirty = true;
}
function iluminate(element) {
    De_iluminate();
    element.classList.add("hovered");
}

function addbutons() {
    // document.querySelectorAll('div[role="row"] div[tabulator-field="fff"]').forEach(div =>
    //     div.insertAdjacentHTML('beforeend',
    //         '<button onclick="pegar_aquí(this);" class="btn btn-secondary btn_paste" >Pegar</button>')
    // );
}

function pegar_aquí(btn) {

    const cellDiv = btn.closest('.tabulator-cell');
    const cell = cellDiv._cell;

    if (cell) {
        cell.setValue(id_last_zone_clicked);
    }
    // btn.parentElement.childNodes[0].textContent = id_last_zone_clicked;

    // const cellDiv = btn.closest('[tabulator-field="fff"]');
    // const cell = cellDiv._cell; Tabulator attaches the real cell here
    // cell.setValue(id_last_zone_clicked);
}

function log(string) {
    var labels = document.getElementsByClassName("label_buscando");
    Array.from(labels).forEach(function (label) {
        print_label(label, string);
    });
}
function downloadData() {
    const text = table.getData()
        .map(r => `${r.patrimonio},${r.itabec},${r.nombre},${r.fff}`)
        .join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_data.txt";
    a.click();

    URL.revokeObjectURL(url);
}
function loadData() {
    fetch("data.txt")
        .then(response => response.text())
        .then(text => {
            show_table(text);
        })
        .catch(err => console.error(err));

    fetch('inventariado 2.svg')
        .then(r => r.text())
        .then(svgCode => {
            const container = document.getElementById('img_countainer');
            container.innerHTML = svgCode;

            const svg = document.getElementById('mapa_itb_');

            svgPanZoom(svg, {
                zoomEnabled: true,
                controlIconsEnabled: true,
                mouseWheelZoomEnabled: true,
                fit: true,
                center: true,
                minZoom: 0.5,
                maxZoom: 10
            });
        });

}

function func1(dom_element)
{
    //showToast("Pegar en: " + dom_element);
    dom_element.parent = id_last_zone_clicked;
    btn.closest('[tabulator-field="fff"]').innerText = id_last_zone_clicked;
}

function checkHealthSVG() {

    const obj = document.getElementById("mapa_itb_");
    const instance = svgPanZoom(obj);

    setTimeout(() => {
        addbutons();
    }, 1000);

    svgPanZoom(obj, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 0.5,
        maxZoom: 10
    });


    setTimeout(() => { centerOnPath(centring_target); }, 1000);


} //also adds paste here buttons via addbuttons();
// Function to center on a specific path

function reset() {
    centerOnPath(centring_target);

}

function centerOnPath(pathId, zoomLevel = 2) {
    const instance = svgPanZoom(document.getElementById("mapa_itb_"), {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true
    });

    const path = document.getElementById(pathId);
    const bbox = path.getBBox();

    instance.center();
    instance.zoom(zoomLevel);

    var xxx = (-bbox.x - bbox.width / 2) + 425;
    var yyy = (-bbox.y - bbox.height / 2) + 325;

    instance.pan({ x: xxx, y: yyy });
}

function switcher() {

    const table = document.getElementById("table");
    const svgfl = document.getElementById("img_countainer");
    console.log(svgfl);
    if (vertical) {
        console.log("---------------");
        
        table.classList.remove("table_container1");
        svgfl.classList.remove("map_container1");
        table.classList.add("table_container2");
        svgfl.classList.add("map_container2");
        vertical = false;
    }
    else {
        console.log("|||||||||||||||||||");
        table.classList.add("table_container1");
        svgfl.classList.add("map_container1");
        table.classList.remove("table_container2");
        svgfl.classList.remove("map_container2");
        vertical = true;
    }

    centerOnPath(centring_target, 1);
//--------------------------------------- hovered stuff
} //----------- vertical-horizontal switcher

function openModal() {
    // console.log("opening");
    var modal = document.getElementById('customModal');
    modal.showModal();
    document.getElementById("customModal").style.display = "block";
    
}

function closeModal() {
    // console.log("closin");
    var modal = document.getElementById('customModal');
    modal.close();
    document.getElementById("customModal").style.display = "none";
}

function diccionario_de_terminos(line) {

    var output = "";

    if (line.includes("=")) { output += " Operativos de"; }
    if (line.includes("&")) { output += " Jefatura de"; }
    if (line.includes("+")) { output += " Lugar adjacente a"; }
    if (line.includes(".")) { output += " Dirección de"; }
    if (line.includes("/")) { output += " Pasillo adjacente a"; }
    if (line.includes("crd")) { output += " Créditos"; }
    if (line.includes("prm")) { output += " Promoción y servicios"; }
    if (line.includes("grl")) { output += " Dirección general"; }
    if (line.includes("arc")) { output += " Archivo"; }
    if (line.includes("rcp")) { output += " Recepción"; }
    if (line.includes("vnt")) { output += " Ventanal"; }
    if (line.includes("ges")) { output += " Gestión servicios"; }
    if (line.includes("car")) { output += " Cartera y recuperación"; }
    if (line.includes("bns")) { output += " Baños"; }
    if (line.includes("jnt")) { output += " Sala de Juntas"; }
    if (line.includes("seg")) { output += " Seguimiento"; }
    if (line.includes("sit")) { output += " Cuarto de Servers"; }
    if (line.includes("jrd")) { output += " Juridico"; }
    if (line.includes("jrd")) { output += " Cobranza"; }
    if (line.includes("kft")) { output += " Cafetería"; }
    if (line.includes("rhm")) { output += " Recursos Humanos"; }
    if (line.includes("oic")) { output += " Organo Interno de Control / Comisaría"; }
    if (line.includes("fnz")) { output += " Finanzas"; }
    if (line.includes("adm")) { output += " Administración y Finanzas"; }
    if (line.includes("stc")) { output += " Secretaría Técnica"; }

    if (output == "" && line != "") {
        output = "### CODIGO INVALIDO ###";
    }

    const match = line.match(/\d+/);
    if (match) { output += " zona " + match[0]; }

    var labels = document.getElementsByClassName("label_buscando");
    Array.from(labels).forEach(function (label) {
        print_label(label, output);
    });

    // switch (line) {
    //     case "=grl6":
    //         console.log("JACKPOT----------");
    //         break;
    // }
}

function print_label(label, output) {
    label.innerHTML = output;
}

function buscar(str) {
    try {
        centerOnPath(str);
        iluminate(document.getElementById(str));
    }
    catch (err) { }


    var rows = document.querySelectorAll('[role="row"]');

    if(str != "")
        Array.from(rows).forEach(function (row) {
            row.classList.add("hidden");
            if (row.innerHTML.includes(str)) {
                row.classList.remove("hidden");
                row.classList.add("selected");
            }
        });
    else
        Array.from(rows).forEach(function (row) {
            row.classList.remove("hidden");
            row.classList.remove("selected");
        });
        
}

function clicked() {
    var pastedText = document.getElementById("pasteArea").value;
    show_table(pastedText);
}

function show_table(pastedText) {

    hide_loading_msg();

    const rows = pastedText
        .trim()
        .split("\n")
        .map(row => row.split("\t"));

    if (rows.length === 0 || rows[0][0] === "") return;

    const headers = ["patrimonio", "itabec", "nombre", "fff"]; // Must match Tabulator 'field'

    const data = rows.map(row => {
        let obj = {};
        headers.forEach((h, i) => {
            // Assign the value if it exists in the row, otherwise default to empty string
            obj[h] = row[i] || "";
        });
        return obj;
    });


    if (!table) {
        table = new Tabulator("#table", {
            data: data,
            layout: "fitColumns",
            // Field must match headers 
            columns: [
                {
                    title: "Patrimonio",
                    field: "patrimonio",
                    editor: "input",
                    editorParams: {
                        elementAttributes: {
                            "id": "edit-patrimonio",
                            "name": "edit-patrimonio"
                        }
                    }
                },
                {
                    title: "Itabec",
                    field: "itabec",
                    editor: "input",
                    editorParams: {
                        elementAttributes: {
                            "id": "edit-itabec",
                            "name": "edit-itabec"
                        }
                    }
                },
                {
                    title: "Nombre/Descripción",
                    field: "nombre",
                    editor: "input",
                    editorParams: {
                        elementAttributes: {
                            "id": "edit-nombre",
                            "name": "edit-nombre"
                        }
                    }
                },
                {
                    title: "Visto por última vez en",
                    field: "fff",
                    formatter: function (cell) {
                        const value = cell.getValue();

                        return `
                            <span class="cell-value">${value ?? ""}</span>
                            <button class="btn btn-secondary btn_paste">Pegar</button>
                        `;
                    },
                    cellClick: function (e, cell) {
                        if (e.target.classList.contains("btn_paste")) {
                            cell.setValue(id_last_zone_clicked);
                        }
                    },
                    editor: "input",
                    editorParams: {
                        elementAttributes: {
                            "id": "edit-ubicacion",
                            "name": "edit-ubicacion"
                        }
                    }
                }
            ],
            cellclick: function (e, cell) {
                console.log("cell clicked...");
                console.log(cell.getColumn().getField());
                cell.edit();
            }
        });
    } else {
        table.setData(data);
    }
}

function hide_loading_msg() {
    document.getElementById("lol").style.display = "none";
}

function showToast(message) {
    var toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        animation: fadeInOut 2s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}