const deleteButton = document.querySelectorAll('.deleteButton')
const modalBody = document.querySelector('#modalBody')
const modalFooter = document.querySelector('#modalFooter')
deleteButton.forEach((element) => {
  element.addEventListener('click', (event) => {
    const data = event.target.dataset
    modalBody.innerHTML = `
    <img class="card-img-top" src="${data.image}" alt="${data.name}" />
    <div class="card-body p-3">
      <h6 class="card-title mb-1 text-secondary">${data.name}</h6>

      <div class="restaurant-category mb-1">
        <i class="fas fa-utensils pr-2"></i>
        ${data.category}
      </div>

      <span class="badge bg-danger ">
        ${data.rating}
        <i class="fas fa-star fa-xs"></i>
      </span>
    </div>
    `
    modalFooter.innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
    <form action="/restaurants/${data.id}?_method=DELETE" method="POST">
      <button type="submit" class="btn btn-danger">確定刪除</button>
    </form>
    `
  })
})


