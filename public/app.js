const cafeList = document.querySelector('#cafe-list');
const add_cafe_form = document.querySelector('#add-cafe-form');

function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id',doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    //deleting data from firestore.
    cross.addEventListener('click',(e)=>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
}

// add data to firestore.
add_cafe_form.addEventListener(
    'submit',(e)=>{
      e.preventDefault();
      db.collection('cafes').add({
          name: add_cafe_form.name.value,
          city: add_cafe_form.city.value
      }); 
      add_cafe_form.name.value = '';
      add_cafe_form.city.value = ''; 
    }
);

// real time listener.
db.collection('cafes').orderBy('city').onSnapshot(
    snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            console.log(change.doc.data());
            if (change.type=='added') {
                renderCafe(change.doc);
            }else if (change.type == 'removed') {
                let li = cafeList.querySelector('data-id='+ change.doc.id +']');
                cafeList.removeChild(li);
            }
        });
    }
);