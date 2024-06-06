function makeHTML(ht){
  const template = document.createElement('template');
  template.innerHTML = ht.trim();
  return template.content.firstElementChild;
}

let taskbar_icon_template_text = `
<div class="taskbar_icons flex-col center anIcon"><p>Haha</p></div>
`;

function rando(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeShitMoveLegacy(theDiv){
    let pos = [0,0,0,0];

    let draggablePlace = theDiv.children;
    let draggableTrue = draggablePlace[0].children[draggablePlace[0].children.length - 1];
    draggableTrue.onmousedown = dragMouse;  
    //draggablePlace[0].children[draggablePlace[0].children.length - 1].addEventListener("click", drgExit);

    function drgExit() {
        //theDiv.remove();
    }  

    function dragMouse(e){
        e = e || window.event; e.preventDefault();

        pos[2] = e.clientX;
        pos[3] = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e){
        e = e || window.event; e.preventDefault();

        pos[0] = pos[2] - e.clientX;
        pos[1] = pos[3] - e.clientY;
        pos[2] = e.clientX;
        pos[3] = e.clientY;

        theDiv.style.top = (theDiv.offsetTop - pos[1]) + "px";
        theDiv.style.left = (theDiv.offsetLeft - pos[0]) + "px";
 
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
  }
}

function makeShitMove(theDiv, theTaskbar, appName){
    let pos = [0,0,0,0];
    let remember_pos = [0,0,0,0];
    let remember_offset = [0,0];
    let remember_size;
    let draggablePlace = theDiv.children;
    let draggableTrue = draggablePlace[0];
    let taskbarIcon = makeHTML(taskbar_icon_template_text);
    let is_minimized = false;

    //behavior
    draggableTrue.onmousedown = dragMouse; 
    theDiv.onmousedown = reTop;

    //icon behavior
    draggablePlace[1].addEventListener('click', reTop);
    draggablePlace[0].children[0].addEventListener('click', drgExit);
    draggablePlace[0].children[1].addEventListener('click', minmax);
    draggablePlace[0].children[2].addEventListener('click', toggle_visibility);
    draggablePlace[0].children[3].addEventListener('click', toggleSnapMenu); 
    draggablePlace[0].children[5].addEventListener('click', left_w50_h100); 
    draggablePlace[0].children[4].addEventListener('click', right_w50_h100);     
    taskbarIcon.addEventListener('click', appear);
    taskbarIcon.onmouseover = appear2;
    taskbarIcon.onmouseout = close2;

    makeTaskbar(appName);
    if(window.innerHeight < window.innerWidth){
        randoFit();
    }else{
        theDiv.style.top = '0vh';
        theDiv.style.left = '0vw';
    };
    
    update_size_data();

    function toggle_visibility(){
        if(is_minimized){
            appear();
        }else{
            close();
        };
      is_minimized = !is_minimized;
    }

    function reFit(){
        theDiv.style.top = (remember_offset[0] - remember_pos[1]) + 'px';
        theDiv.style.left = (remember_offset[1]- remember_pos[0]) + 'px';
    }

    function update_size_data(){
        remember_size = theDiv.getBoundingClientRect();
    }

    function set_size(){
        theDiv.style.width = remember_size.width.toString()+"px";
        theDiv.style.height = remember_size.height.toString()+"px";
        console.log("sized haha", theDiv.style.height);
    }

    function remember_fit(){
        remember_pos = pos;
        remember_offset[0] = theDiv.offsetTop;
        remember_offset[1] = theDiv.offsetLeft
    }

    function randoFit(){
        let rando1 = rando(20, 85).toString();
        let rando2 = rando(20, 85).toString();
        theDiv.style.top = rando1+'vh';
        theDiv.style.left = rando2+'vw';
    }

    function reFitCustom(top, left){
        remember_fit();
        theDiv.style.top = top.toString()+'%';
        theDiv.style.left = left.toString()+'%';
    }


    function reTop(){
        allDiv = document.querySelectorAll('.menu');

        allDiv.forEach(element => {
            element.style.zIndex = '49';
        });

        theDiv.style.zIndex = '50';
    }

    let is_snap_closed = true;
    
    function toggleSnapMenu(){
        if(is_snap_closed){
            draggablePlace[0].children[4].style.display = 'block';
            draggablePlace[0].children[5].style.display = 'block';
        }else{
            draggablePlace[0].children[4].style.display = 'none';
            draggablePlace[0].children[5].style.display = 'none';
        };
        is_snap_closed = !is_snap_closed;
    }

    function drgExit() {
        theDiv.remove();
        taskbarIcon.remove();
    }  

    let is_div_small = false;
    function minmax(){
        if(is_div_small == true){
            reFit();
            reTop();
            set_size();

        }else{
            reTop();
            reFitCustom(0,0);
            theDiv.style.width = "100vw";
            theDiv.style.height = "100vh";

        }

        is_div_small = !is_div_small;

    }

    function left_w50_h100(){
        reFitCustom(0,0);
        theDiv.style.width = "50vw";
        theDiv.style.height = "100vh";
        is_div_small = true;
    }

    function right_w50_h100(){
        reFitCustom(0,50);
        theDiv.style.width = "50vw";
        theDiv.style.height = "100vh";
        is_div_small = true;
    }
   
   
    function close() {
        theDiv.style.display = 'none';
    }  
    function close2() {
        if(is_minimized){
          theDiv.style.display = 'none';
        };
    }  
    function appear(){
        reTop();
        is_minimized = false;
        theDiv.style.display = 'block';
    }
    function appear2(){
        reTop();
        theDiv.style.display = 'block';
    }
    function makeTaskbar(txt){
        taskbarIcon.children[0].innerHTML = txt;
        theTaskbar.appendChild(taskbarIcon);
    }

    function dragMouse(e){
        e = e || window.event; e.preventDefault();

        pos[2] = e.clientX;
        pos[3] = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

    }

    function elementDrag(e){
        e.preventDefault();

        pos[0] = pos[2] - e.clientX;
        pos[1] = pos[3] - e.clientY;
        pos[2] = e.clientX;
        pos[3] = e.clientY;

        theDiv.style.top = (theDiv.offsetTop - pos[1]) + 'px';
        theDiv.style.left = (theDiv.offsetLeft - pos[0]) + 'px';
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
  }




}

function boom(theContainer, theTaskbar, theDiv, theLink, theAppName){
    theDiv.children[1].src = theLink;
    theContainer.appendChild(theDiv)
    makeShitMove(theDiv, theTaskbar, theAppName);
}

async function fetch_master(luink) {
    let x = await fetch(luink);
    let y = await x.text();
    let z = await JSON.parse(y);
    return z;
};

async function CRUD_master(link, json){
  // use await to get the response from the fetch call
    let message = [];
    if(json != null){
        message = JSON.stringify(json);
    };

    let response = await fetch(link, {
        method: "POST",
        body: message,
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    });

    // check if the response is ok
    if (response.ok) {
        // use await to get the JSON object from the response
        let data = await response.json();
        // return the JSON object
        return data;
    } else {
        // handle errors
        throw new Error('HTTP error! status: ${response.status}');
    };
};

async function fetch_master(luink) {
    let x = await fetch(luink);
    let y = await x.text();
    let z = await JSON.parse(y);
    return z;
};

    function rando(offset){
        return Math.floor(Math.random() * offset) + 1;
    };

function monthDiff(date1, date2) {
  // Split the dates into day, month and year
  let [d1, m1, y1] = date1.split("/");
  let [d2, m2, y2] = date2.split("/");

  // Convert the dates to numbers
  d1 = Number(d1);
  m1 = Number(m1);
  y1 = Number(y1);
  d2 = Number(d2);
  m2 = Number(m2);
  y2 = Number(y2);

  // Calculate the difference in months
  let diff = (y2 - y1) * 12 + (m2 - m1);

  // Adjust the difference if the second date is earlier in the month than the first date
  if (d2 < d1) {
    diff--;
  }

  // Return the difference
  return diff;
};

function getCurrentDate2() {
  // Create a new Date object with the current date and time
  let date = new Date();
  // Get the year, month and day from the date object
  let year = date.getFullYear();
  let month = date.getMonth() + 1; // Month is zero-based, so add one
  let day = date.getDate();
  // Pad the month and day with leading zeros if needed
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  // Return the formatted date as a string
  return year + "-" + month + "-" + day;
};

function getCurrentDate() {
  // Get the current date object
  let date = new Date();

  // Get the day, month and year
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are zero-based
  let year = date.getFullYear();

  // Add leading zeros if needed
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  // Return the date as a string
  return day + "/" + month + "/" + year;
};

function convertDate(dateString) {
  // Split the date string into year, month and day
  let [year, month, day] = dateString.split("-");

  // Return the date as a string in dd/mm/yyyy format
  return day + "/" + month + "/" + year;
}

function monthDayDiff(date1, date2) {
  // Split the dates into day, month and year
  let [d1, m1, y1] = date1.split("/");
  let [d2, m2, y2] = date2.split("/");

  // Convert the dates to numbers
  d1 = Number(d1); m1 = Number(m1); y1 = Number(y1); d2 = Number(d2); m2 = Number(m2); y2 = Number(y2);

  // Create date objects from the numbers
  let dateObj1 = new Date(y1, m1 - 1, d1); // Months are zero-based
  let dateObj2 = new Date(y2, m2 - 1, d2);

  // Calculate the difference in milliseconds
  let diffMs = Math.abs(dateObj2 - dateObj1);

  // Convert the difference to days
  let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Calculate the difference in months
  let diffMonths = Math.floor(diffDays / 30);

  // Adjust the difference in days to account for the remaining days after dividing by 30
  diffDays = diffDays % 30;

  // Return the difference as a string in the format of "x months and y days"
  return diffMonths + " Bulan, " + diffDays + " Hari";
}

function dateWithMonthName(dateString) {
  // Split the date string into day, month and year
  let [day, month, year] = dateString.split("/");

  // Convert the month to a number
  month = Number(month);

  // Create an array of month names in Indonesian
  let monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Get the month name from the array using the month number as the index
  let monthName = monthNames[month - 1]; // Months are zero-based

  // Return the date as a string in the format of "dd MonthName yyyy"
  return day + " " + monthName + " " + year;
}

function getUniqueValues(array) {
  // Create an empty set to store the unique values
  let uniqueSet = new Set();
  // Loop through the array elements
  for (let element of array) {
    // Add each element to the set, which will automatically remove any duplicates
    uniqueSet.add(element);
  }
  // Convert the set back to an array and return it
  return [...uniqueSet];
}

function dateDiff(date1, date2) {
  // Parse the dates as milliseconds
  var d1 = Date.parse(date1);
  var d2 = Date.parse(date2);

  // Check if the dates are valid
  if (isNaN(d1) || isNaN(d2)) {
    return "Invalid date format";
  }

  // Calculate the difference in milliseconds and convert to days
  var diff = Math.abs(d2 - d1); // absolute value to avoid negative results
  var days = diff / (1000 * 60 * 60 * 24); // milliseconds to days

  // Return the result
  return days;
}