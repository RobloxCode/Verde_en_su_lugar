function showResults() {

  if(!document.querySelector('.result-text')) {

    const treesContainer = document.querySelector('.trees-container');
    const h1 = document.createElement('h1');
    h1.classList.add('result-text');
    h1.innerText = 'En tu localidad puedes plantar:';

    const div1 = document.createElement('div');
    div1.classList.add('tree-photo-container');
    div1.innerHTML = `
      <h2 class="tree-name">Jacaranda</h2>
      <img src="tree-photos/jacaranda.jpg" class="tree-photo photo-1">
    `;

    const div2 = document.createElement('div');
    div2.classList.add('tree-photo-container');
    div2.innerHTML = `
      <h2 class="tree-name">Fresno</h2>
      <img src="tree-photos/fresno.jpg" class="tree-photo photo-2">
    `;

    const div3 = document.createElement('div');
    div3.classList.add('tree-photo-container');
    div3.innerHTML = `
      <h2 class="tree-name">Eucalipto</h2>
      <img src="tree-photos/eucalipto.jpg" class="tree-photo photo-3">
    `;

    treesContainer.append(h1);
    treesContainer.append(div1);
    treesContainer.append(div2);
    treesContainer.append(div3);
    
    document.querySelector('.photo-1').addEventListener('click', () => {
      takeToInfoPage('https://nuestraflora.com/c-arboles/arbol-de-jacaranda/');
    });
    
    document.querySelector('.photo-2').addEventListener('click', () => {
      takeToInfoPage('https://nuestraflora.com/c-arboles/arbol-fresno/');
    });
    
    document.querySelector('.photo-3').addEventListener('click', () => {
      takeToInfoPage('https://nuestraflora.com/c-arboles/tipos-de-eucalipto/');
    });

  }
}

function takeToInfoPage(link) {
  window.open(link, '_blank');
}

document.querySelector('.show-trees-button').addEventListener('click', showResults);