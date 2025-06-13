const sortSelect = document.getElementById('sort');

sortSelect.addEventListener('change', () => {
  let cards = Array.from(document.querySelectorAll('.car'));

  if (sortSelect.value === 'low-high') {
    cards.sort((a, b) =>
      parseFloat(a.querySelector('.car-info').dataset.price) -
      parseFloat(b.querySelector('.car-info').dataset.price)
    );
  } else if (sortSelect.value === 'high-low') {
    cards.sort((a, b) =>
      parseFloat(b.querySelector('.car-info').dataset.price) -
      parseFloat(a.querySelector('.car-info').dataset.price)
    );
  }

  const allContainers = document.querySelectorAll('.allcars');
  allContainers.forEach(container => (container.innerHTML = ''));

  const firstContainer = document.querySelector('.allcars');
  cards.forEach(card => firstContainer.appendChild(card));
});

const cartype=document.getElementById('car-type');
cartype.addEventListener('change',()=>{
  const selectedType = cartype.value;
  let cars = Array.from(document.querySelectorAll('.car'));

  cars.forEach(car => {
    const carType = car.getAttribute('data-type');

    if (selectedType === 'all' || carType === selectedType) {
      car.style.display = 'block'; 
    } else {
      car.style.display = 'none';  
    }
  });
});


