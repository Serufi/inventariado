function loadData() {
    toast("loading...");
    fetch("db1.txt").then(response => response.text()).then(text => { crear_tabla(text); }).catch(err => console.error(err));

}

function input(elem) {
    var text = elem.value;
    crear_tabla(text);
}

function addEvents() {
    /// called from crear_tabla()
    // touch controls
    checkPercs();
    const items = document.querySelectorAll(".item");
    items.forEach(item => {

        item.classList.remove("returning");

        let startX;
        let startY;
        let startTime;

        item.addEventListener("pointerdown", e => {
            startX = e.clientX;
            startY = e.clientY;
            startTime = performance.now();
        });

        item.addEventListener("pointerup", e => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const dt = performance.now() - startTime;

            // Ignore mostly vertical gestures
            if (Math.abs(dy) > Math.abs(dx))
                return;

            // Fast enough and far enough?
            if (dt < 300 && Math.abs(dx) > 60) {
                if (dx > 0) {
                    console.log("Favorite: " + item.id);

                    if (item.classList.contains("selected")) {

                        item.classList.add("deselecting");
                        item.classList.remove("selected");

                    } else {

                        item.classList.add("selecting");
                        item.classList.add("selected");
                    }
                }

                else {
                    console.log("Delete:   " + item.id);

                    if (item.classList.contains("selected")) {

                        item.classList.add("deselecting");
                        item.classList.remove("selected");

                    } else {

                        item.classList.add("returning");

                    }
                }
                 
            }
            checkPercs();

            setTimeout(() => {
                item.classList.remove("returning");
                item.classList.remove("deselecting");
                item.classList.remove("selecting");
            }, 200);
        });
    });
}

function checkPercs() {

    // var SELEC = document.querySelectorAll(".status-icon1").length;
    // var TOTAL = document.querySelectorAll(".item").length;


    // by_id("perc").innerHTML = Math.trunc(100 * (SELEC / TOTAL)) + "%";
    // by_id("tot").innerHTML = SELEC + " / " + TOTAL;
}
function display(id) { console.log(id); }
function by_id(_id) {   return document.getElementById(_id);    }
function by_css(_class) { return Array.from(document.getElementsByClassName(_class)); }
// const cards = by_class("asset-card"); // <----------- usage
// cards.forEach(card => {   console.log(card);   });
function crear_tabla(text) {
    const rows = text.trim().split("\n");

    let html = "";
    var conteo = 0;

    // 1. Initialize an empty Set before your loop
    let uniqueValues = new Set();

    rows.forEach(row => {
        const cols = row.split("\t");
        conteo++;
        var icon = cols[2];
        try {
            icon = icon.toLowerCase();
        } catch { }
        html += crear_carta(
            conteo, // id para conteo
            cols[0], // id patrimonio
            cols[1], // id itabec
            cols[2], // objeto descripción
            cols[3], // marca
            cols[5], // subresguardante
            cols[4], // dirección a la que pertenece
            cols[7], // ubicación
            cols[6], // tipo
            getIcon(icon)
        );

        uniqueValues.add(cols[4]);

    });

    // 3. Convert it back to a normal Array or JSON if needed
    let finalResultArray = Array.from(uniqueValues);
    console.log(finalResultArray);

    document.getElementById("table_container").innerHTML = html;

    setTimeout(() => { addEvents(); }, 1000);
}
function getIcon(desc) {
    var icon = ""; //🗄️🖥️💻📦🚙🪑💺📞🖨️ ❄ //🗄︎🖥︎💻︎📦︎🚙︎🪑︎💺︎📞︎🖨︎ ❄︎
    icon = "💭";
    if (desc.includes("dulo") || desc.includes("escr") || desc.includes("mesa")) { icon = "🗔︎"; }
    if (desc.includes("aire") || desc.includes("split")) { icon = "❄"; }
    if (desc.includes("visi") || desc.includes("sita"))  { icon = "🪑"; }
    if (desc.includes("sill") || desc.includes("sofa"))  { icon = "💺︎"; }
    if (desc.includes("lefo") || desc.includes("fono"))  { icon = "📞︎"; }
    if (desc.includes("moni") || desc.includes("unid"))  { icon = "🖥︎"; }
    if (desc.includes("compu")   || desc.includes("orden")) { icon = "💻︎"; } // Computadora / PC
    if (desc.includes("all") && desc.includes(" uno"))   { icon = "🖥︎"; }  //🖥💻︎
    if (desc.includes("chivero") || desc.includes("stante")) { icon = "📦︎"; }
    if (desc.includes("gab") || desc.includes("etas"))   { icon = "🗄️"; }
    if (desc.includes("veh") || desc.includes("carr") || desc.includes("camio")) { icon = "🚙︎"; }

    // New items added below:
    if (desc.includes("abanico") || desc.includes("venti")) { icon = "🪭︎"; } // Fan / Ventilador
    if (desc.includes("frigo")   || desc.includes("refr")) { icon = "🧊︎"; }  // Frigobar / Minibar
    if (desc.includes("horno")   || desc.includes("micr")) { icon = "♨︎"; }  // Oven / Microwave heat symbol
    if (desc.includes("impre")) { icon = "🖨︎"; }                            // Printer
    if (desc.includes("scann")   || desc.includes("escan")) { icon = "📠︎"; } // Scanner / Fax style plate
    if (desc.includes(" v ") || desc.includes("tv") || desc.includes("televi")) { icon = "📺︎"; } // TV / V entry
    if (desc.includes("subest")  || desc.includes("electr")) { icon = "⚡︎"; } // Subestación / High Voltage Sign
    if (desc.includes("andamio") || desc.includes("escal")) { icon = "🪜︎"; } // Andamio / Ladder / Structure
    if (desc.includes("proyec")) { icon = "📹︎"; } // Projector / Video Camera glyph
    if (desc.includes("camara")) { icon = "📹︎"; } // Projector / Video Camera glyph
    if (desc.includes("lector")) { icon = "📟"; } // Projector / Video Camera glyph
    if (desc.includes("cafe")    || desc.includes("coffe")) { icon = "☕︎"; } // Cafetera / Hot Beverage

    return icon;
}
function toast(message) {
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
function changeStatus(int) {
    var strip = document.getElementById("strip_" + int) ?? false;
    var icon = document.getElementById("icon_" + int) ?? false;

    if (strip) {
        strip.classList.toggle("status-strip");
        strip.classList.toggle("status-strip1");

        if (strip.classList.contains("status-strip1")) {
            icon.innerHTML = "✓";
        }
        else {
            icon.innerHTML = "?";
        }
    }
    if (icon) {
        icon.classList.toggle("status-icon");
        icon.classList.toggle("status-icon1");
    }

}
function crear_carta(no, patromonio, itabec, objeto, marca, subresguardante, direccion, ubicacion, tipo, icon) {
    let cleanUbicacion = "";

    try {
        cleanUbicacion = ubicacion.trim();
    } catch (err) {
        cleanUbicacion = "error";

    }

    return `        
        <div id="card_${no}" onmouseover="display(\'${cleanUbicacion}\')" onload="addEvents()" class="table_container1">
            <div id="asscard_${no}" class="asset-card item returning">

                <div id="strip_${no}" class="status-strip" onclick="changeStatus(${no})">
                    <div id="icon_${no}" class="status-icon" onclick="display(\'${cleanUbicacion}\');">?</div>
                </div>

                <div class="card-content" style="display: flex; flex-direction: row;">

                        <div class="asset-info" >
                            <div class="asset-icon"> ${icon} </div>
                            <div > 
                                <div class="asset-details" style="display: flex; flex-direction: column;">${objeto}</div>
                                <div>  <div class="brand">${marca}  (${tipo})</div> </div>
                                <div class="field2"> <span class="label"></span> <span class="badge text-bg-primary">•${patromonio}</span> </div>
                            </div>
                        </div>
                        
                        <hr>

                        <div class="actions">
                            <div style="display: flex; flex-direction: column; margin-right: 30px;">
                                <div class="field">  <span class="label">🧑‍💼</span> <span class="value">${subresguardante}</span> </div>
                                <div class="field">  <span class="label">🏛️</span> <span class="value">${direccion}</span> </div>
                                <div class="field2"> <span class="label"></span> <span class="badge text-bg-secondary">${itabec}</span> </div>
                            </div>    
                        </div>
                    

                </div>
            </div>
        </div>
    `;
}



/*


   <div id="card_${no}" onmouseover="display(\'${cleanUbicacion}\')" onload="addEvents()" class="table_container1">
            <div id="asscard_${no}" class="asset-card item returning">

                <div id="strip_${no}" class="status-strip" onclick="changeStatus(${no})">
                    <div id="icon_${no}" class="status-icon" onclick="display(\'${cleanUbicacion}\');">?</div>
                </div>

                <div class="card-content">
                    <div class="card-header">
                        <div class="asset-info">
                            <div class="asset-icon"> ${icon} </div>
                            <div> 
                                <div class="asset-details" style="display: flex; flex-direction: column;">${objeto}</div>
                                <div>
                                    <div class="brand">${marca}  (${tipo})</div>
                                </div>
                            </div>
                        </div>

                        <div class="actions">
                            <div style="display: flex; flex-direction: column; margin-right: 30px;">
                                <div class="field">  <span class="label">🧑‍💼</span> <span class="value">${subresguardante}</span> </div>
                                <div class="field">  <span class="label">🏛️</span> <span class="value">${direccion}</span> </div>
                            </div>    
                        </div>
                    </div>

                    <hr>

                    <div class="metadata">
                        <div style="display: flex; flex-direction: row; gap: 10px;">
                            <button type="button" class="btn btn-secondary bl"    onclick="localizar(${cleanUbicacion})">🔎 Localizar (<span >${cleanUbicacion}</span>)</button>
                            <button type="button" hidden class="btn btn-primary" onclick="display(${cleanUbicacion})"> 👀 Ver </button>
                            <button type="button" class="btn btn-success" onclick="Copiar(${no})"> 📋 </button>
                        </div> 
                        <div style="display: flex; flex-direction: column; align-items: flex-start; margin-left: 40px;">
                            <div class="field2"> <span class="label"></span> <span class="badge text-bg-primary">•${patromonio}</span> </div>
                            <div class="field2"> <span class="label"></span> <span class="badge text-bg-secondary">${itabec}</span> </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>


 */

function closeModal() {
    // console.log("closin");
    var modal = document.getElementById('customModal');
    modal.close();
    modal.classList.remove("active_modal");

}

function openModal() {
    // console.log("opening");
    var modal = document.getElementById('customModal');
    modal.showModal();
    modal.classList.add("active_modal");

}