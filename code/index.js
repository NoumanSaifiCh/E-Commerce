let page = 1;
let limit = 12;
// API to Fetch the Data //
async function handleProduct(categary, search, skip = 0) {
  try {
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    if (categary) {
      url = `https://dummyjson.com/products/category/${categary}`;
    } else if (search) {
      url = `https://dummyjson.com/products/search?q=${search}`;
    }

    let getProduct = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    let productResult = await getProduct.json();

    let addedProducts = localStorage.getItem("addedProducts")
      ? JSON.parse(localStorage.getItem("addedProducts"))
      : [];

    productResult = [...addedProducts, ...productResult.products];

    let editedProductsArray = localStorage.getItem("editProducts")
      ? JSON.parse(localStorage.getItem("editProducts"))
      : [];

    let productsToDeleteIds = localStorage.getItem("deleteProducts")
      ? JSON.parse(localStorage.getItem("deleteProducts"))
      : [];

    let productData;

    productResult.forEach((element) => {
      let editedProduct = editedProductsArray?.find(
        (item) => item.id == element.id
      );
      if (editedProduct) element = { ...element, ...editedProduct };

      let deletedProductId = productsToDeleteIds?.find(
        (id) => id == element.id
      );
      if (deletedProductId) return;

      let productView = `<div onclick="handleProductViewDetail(${element.id})" class="col-lg-3  col-md-6 col-sm-12 card mx-2 my-2  productCard ">
    <img src="${element.thumbnail}"  class="card-img-top" alt="product" height="230">
    <div class="card-body">
      <h5 class="card-title text-center">${element.title}</h5>
      <p class="card-text text-center cardText">${element.description}</p>
      <p class="text-center" ><strong><span class="text-danger">Discount ${element.discountPercentage}% </span> $ ${element.price}</strong></p>
      <div class="small-ratings text-center">
        <i class="fa fa-star rating-color checked"></i>
        <i class="fa fa-star rating-color checked"></i>
        <i class="fa fa-star rating-color checked"></i>
        <i class="fa fa-star checked"></i>
        <i class="fa fa-star"></i>
    </div>
    </div>
  </div>
`;
      productData = productData ? productData + productView : productView;
      document.getElementById("productCard").innerHTML = productData;
    });
  } catch (error) {
    console.log("error message", error);
  }
}
handleProduct();

//below function to handle specific product detail
function handleProductViewDetail(id) {
  window.location.href = "produtView.html?id=" + id; //id will be forward in url
}

//below function to handle category product detail
async function handleCategory() {
  try {
    let getCatagoryProduct = await fetch(
      "https://dummyjson.com/products/categories",
      {
        method: "GET",
      }
    );
    let categaryResult = await getCatagoryProduct.json();
    categaryResult.slice(1, 20).forEach((element) => {
      let categary = `<li><button  type="button" class="btn btn-light p-0 mx-2" onclick="handleProduct('${element}')">${element}</button></li>`;
      document.getElementById("categoryId").innerHTML += categary;
    });
  } catch (error) {
    console.log("Category Fetch Error", error);
  }
}
handleCategory();

function handleSearchProduct() {
  //handel search
  let productType = document.getElementById("searchProduct").value;
  handleProduct(null, productType);
}

function handleProductPaginationforward() {
  // Handle pagination
  page = page + 1;
  let skip = (page - 1) * limit;

  document.getElementById("previous-btn").style.pointerEvents = "auto";
  document.getElementById("previous-btn").style.opacity = "1";
  if (page == 10) {
    document.getElementById("next-btn").style.pointerEvents = "none";
    document.getElementById("next-btn").style.opacity = "0.6";
    return;
  }
  document.getElementById("products-count-display").innerHTML = `${
    skip + 1
  } - ${limit * page} of 100`;
  handleProduct(null, null, skip);
}

function handleProductPaginationBackward() {
  page = page - 1;
  let skip = (page - 1) * limit;
  document.getElementById("next-btn").style.pointerEvents = "auto";
  document.getElementById("next-btn").style.opacity = "1";
  if (page == 1) {
    document.getElementById("previous-btn").style.pointerEvents = "none";
    document.getElementById("previous-btn").style.opacity = "0.6";
    return;
  }
  document.getElementById("products-count-display").innerHTML = `${
    skip + 1
  } - ${limit * page} of 100`;
  handleProduct(null, null, skip);
}
