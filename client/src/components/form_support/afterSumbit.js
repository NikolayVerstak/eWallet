/* ----------- 
ACTIONS THAT SHOULD BE DONE AFTER SUBMITTING OF THE FORM
----------- */

export function afrerSumbit() {
    // make select options of the from from black color(active) to grey(default)
    const selects = document.querySelectorAll("select.black");
    for (let i = 0; i < selects.length; i++) {
        selects[i].classList.remove("black");
    }
}
