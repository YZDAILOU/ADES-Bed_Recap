
const isLocalhost = true;
// const isLocalhost = location.host === 'localhost' || location.host === '127.0.0.1';
const STORAGE_API_HOST = isLocalhost ? `http://localhost:3000` : `https://keyval-store.herokuapp.com`;
const letterGrades = {
    4: 'A',
    3.5: 'B+',
    3: 'B',
    2.5: 'C+',
    2: 'C',
    1.5: 'D+',
    1.0: 'D',
    0.5: 'D-',
    0: 'F',
};
const modules = {};

window.addEventListener('DOMContentLoaded', function () {
    //assigning variables to the input from front end by using document.querySelector(id)
    // Table
    const moduleTableBody = document.querySelector('#module-table tbody');
    const moduleRowTemplate = document.querySelector('#module-row-template');

    // Result
    const gpaResult = document.querySelector('#gpa-result');
    const chickenRiceResult = document.querySelector('#chicken-rice-result');

    // Add module
    const addModuleForm = document.querySelector('#new-module-form');
    const moduleNameInput = addModuleForm.querySelector('#module-name');
    const creditInput = addModuleForm.querySelector('#credit');
    const gradeInput = addModuleForm.querySelector('#grade');

    // Generate sharing link
    const shareID = document.querySelector('#shareID');
    const generateLinkButtonShareId = document.querySelector('#generate-link-shareid');
    const generateLinkButton = document.querySelector('#generate-link');
    const shareLinkInput = document.querySelector('#share-link');
    const timeGeneratedField = document.querySelector('#time-generated');

    //Delete expired record 
    const deleteRecordButton = document.querySelector('#delete');

    // All intractable controls (e.g. input, buttons, etc...)
    //an array of controls in the form
    const controls = [
        addModuleForm.querySelector('button'),
        moduleNameInput,
        creditInput,
        gradeInput,
        generateLinkButton,
        generateLinkButtonShareId,
        shareID,
    ];

    /**
     * Disable controls in page
     */
    function disablePage() {
        //foreach go through every action in the control array and disable them --> user cannot interact
        controls.forEach((control) => (control.disabled = true));
    }

    /**
     * Enables controls in page
     */
    function enablePage() {
        //foreach go through every action in the control array and enable them --> user can interact
        controls.forEach((control) => (control.disabled = false));
    }

    /**
     * Create a new row with delete button --> adding modules
     */
    function createRow(moduleName, credit, grade, onDelete) {
        const newRow = moduleRowTemplate.content.firstElementChild.cloneNode(true);
        newRow.querySelector('.row-name').textContent = moduleName;
        newRow.querySelector('.row-credit').textContent = credit;
        newRow.querySelector('.row-grade').textContent = grade;
        newRow.querySelector('.row-delete').onclick = () => onDelete(newRow);
        return newRow;
    }

    /**
     * Create a new row and update modules object
     */
    function createModuleWithId(moduleName, credit, grade) {
        const id = Date.now();
        modules[id] = { name: moduleName, credit, grade };
        const newRow = createRow(moduleName, credit, grade, (newRow) => {
            moduleTableBody.removeChild(newRow);
            delete modules[id];
            updateResult();
        });
        newRow.id = id;
        return newRow;
    }

    /**
     * Create an array of module based on the table
     */
    function getModules() {
        const rows = moduleTableBody.querySelectorAll('tr');
        const result = [];
        rows.forEach((row) => {
            const id = row.id;
            result.push(modules[id]);
        });
        return result;
    }

    /**
     * Compute GPA based on the modules provided
     */
    function computeGpa(modules) {
        let totalCredit = 0;
        let totalScore = 0;
        modules.forEach((module) => {
            const { credit, grade } = module;
            totalScore += credit * grade;
            totalCredit += credit;
        });
        if (totalCredit === 0) return 0;
        return totalScore / totalCredit;
    }

    /**
     * Computes GPA based on the modules in the table and update the result
     */
    function updateResult() {
        const modules = getModules();
        const gpa = computeGpa(modules);
        const canBuyChickenRice = gpa >= 3.5;
        gpaResult.textContent = gpa.toFixed(2);
        chickenRiceResult.textContent = canBuyChickenRice ? 'YES' : 'NO';
    }

    /**
     * Add a new row to the table.
     */
    addModuleForm.onsubmit = function (e) {
        e.preventDefault();
        const moduleName = moduleNameInput.value;
        const credit = +creditInput.value;
        const grade = +gradeInput.value;

        const newRow = createModuleWithId(moduleName, credit, grade);
        moduleTableBody.appendChild(newRow);
        updateResult();
        return false;
    };

    /**
     * Uploads modules data to storage and generate sharing link based on returned key
     */
    //the data will only be added into the database when user press on the generate link button 
    generateLinkButton.onclick = function () {
        disablePage();
        const modules = getModules();

        fetch(`${STORAGE_API_HOST}/storage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(modules),
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log("key: " + JSON.stringify(json.responsekey));
                const key = json.responsekey;
                const url = new URL(window.location.href);
                url.searchParams.set('key', key);
                shareLinkInput.value = url.toString();
                timeGeneratedField.textContent = new Date().toLocaleString();
            })
            .catch((error) => 
            console.log(error)
            //alert(error.message)
            )
            .finally(() => enablePage());
    };

    generateLinkButtonShareId.onclick = function (e) {
        e.preventDefault();
        disablePage();
        const modules = getModules();
        //extracted data for body
        let extractedData = {
            "data": modules,
            "key": shareID.value
        }

        fetch(`${STORAGE_API_HOST}/storage/shareId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(extractedData),
        })
            .then((response) => {
                if (!response.ok) {

                    throw new Error(`Key is already in use! Use a different unique key, or leave it as blank`)
                }
                return response.json();
            })
            .then((json) => {
                console.log("share id key: " + JSON.stringify(json.responsekey));
                const key = json.responsekey;
                const url = new URL(window.location.href);
                url.searchParams.set('key', key);
                shareID.value = url.toString();
                timeGeneratedField.textContent = new Date().toLocaleString();
            })
            .catch((error) => console.log(error.message))
            .finally(() => enablePage());
    };

    
    deleteRecordButton.onclick = function (e) {
        e.preventDefault();//prevent the default behaviour
        disablePage();
        //disablePage();
        //generate the timestamp now , 10 digit only
       const currentTimeStamp = Math.floor(Date.now() / 1000);
        //const currentTimeStamp = 2000000000;
        //check
        //console.log(currentTimeStamp);
        //packing the data to be passed over as req.body
        console.log(currentTimeStamp);
        //call the endpoint and passed the relavent details 
        fetch(`${STORAGE_API_HOST}/storage?currentTimeStamp=${currentTimeStamp}`, {
            method: 'DELETE',
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            alert((json.response) + " records Successfully deleted...");
        })
        .catch((error) => alert(error.message))
        .finally(() => enablePage());
    };






    /**
     * Loads modules data from storage and populate page
     */
    function loadDataFromKey(key) {
        disablePage();
        fetch(`${STORAGE_API_HOST}/storage?key=${key}`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((json) => {       
                const modules = JSON.parse(json.result);
                modules.forEach((module) => {
                    const { name: moduleName, credit, grade } = module;
                    const newRow = createModuleWithId(moduleName, credit, grade);
                    moduleTableBody.appendChild(newRow);
                });
                updateResult();
            })
            .catch((error) => console.log(error.message))
            .finally(() => enablePage());
    }

    /**
     * Check for key in url and loads module data
     */
    const currentUrl = new URL(window.location.href);
    const key = currentUrl.searchParams.get('key');
    if (key) loadDataFromKey(key);
});
