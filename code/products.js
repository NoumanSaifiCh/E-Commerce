var productsArray = [];
var deleteProductsArray = [];

let getUpdatedItem = localStorage.getItem("editProducts");
//console.log(getUpdatedItem.id,"id");
async function handleProduct() {
  try {
    let getProduct = await fetch("https://dummyjson.com/products", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    let productResult = await getProduct.json();

    productsArray = productResult.products;

    let addedProducts = localStorage.getItem("addedProducts")
      ? JSON.parse(localStorage.getItem("addedProducts"))
      : [];

    productResult = [...addedProducts, ...productResult.products];

    let editProductsArray = localStorage.getItem("editProducts")
      ? JSON.parse(localStorage.getItem("editProducts"))
      : [];

    let productsToDeleteIds = localStorage.getItem("deleteProducts")
      ? JSON.parse(localStorage.getItem("deleteProducts"))
      : [];

    let productsDetils;

    productResult.forEach((element, index) => {
      let editedProduct = editProductsArray?.find(
        (item) => item.id == element.id
      );
      if (editedProduct) {
        element = { ...element, ...editedProduct };
      }

      let deletedProductId = productsToDeleteIds?.find(
        (id) => id == element.id
      );
      if (deletedProductId) return;

      if (addedProducts.length > 0) {
        element.id = ++element.id;
      }

      let productData = `<tr> <th scope="row">${index + 1}</th>

      <td>
          <img
            class="img-fluid "
            src="${element.thumbnail}"
            alt=""
            width="50px"
            height="50px"
          />
        </td>
      <td>${element.title}</td>
      <td>${element.description}</td>
      <td>${element.price}</td>
      <td><i class="fa-solid fa-pen-to-square mx-3" data-bs-toggle="modal" data-bs-target="#exampleModal"
          onclick="handleEditProduct(${element?.id})"></i>
          <i class="fa-solid fa-trash mx-3" onclick="handleDeleteProduct(${
            element?.id
          })"></i>
      </td>
    </tr>`;

      productsDetils = productsDetils
        ? productsDetils + productData
        : productData;
      document.getElementById("allProduct").innerHTML = productsDetils;
    });
  } catch (error) {
    console.log("error message", error);
  }
}
handleProduct();

function handleEditProduct(id) {
  document.getElementById("modal-heading").innerHTML = "Edit Product";
  document.getElementById("modal-save-button").innerHTML = "Update";

  let product = productsArray.find((item) => item.id == id);
  if (!product) return;

  let editedProductDetail = localStorage.getItem("editProducts")
    ? JSON.parse(localStorage.getItem("editProducts"))
    : [];

  if (editedProductDetail.length > 0) {
    product = editedProductDetail.find((item) => item.id == product?.id);
    if (!product) return;
  }

  document.getElementById("product-title").value = product.title;
  document.getElementById("product-description").value = product.description;
  document.getElementById("product-price").value = product.price;
  //document.getElementById("product-image").value=product.title.thumbnail;
  document.getElementById("product-id").value = product.id;
}

function handleUpdateProduct() {
  let title = document.getElementById("product-title").value;
  let description = document.getElementById("product-description").value;
  let price = document.getElementById("product-price").value;
  let id = document.getElementById("product-id").value;
  // let thumbnail = document.getElementById("product-image").value;
  let product = { id, title, description, price };

  let productsToEdit = localStorage.getItem("editProducts")
    ? JSON.parse(localStorage.getItem("editProducts"))
    : [];

  localStorage.setItem(
    "editProducts",
    JSON.stringify([...productsToEdit, product])
  );

  handleProduct();
}
function handleDeleteProduct(id) {
  let productsToDeleteIds = localStorage.getItem("deleteProducts")
    ? JSON.parse(localStorage.getItem("deleteProducts"))
    : [];

  localStorage.setItem(
    "deleteProducts",
    JSON.stringify([...productsToDeleteIds, id])
  );

  handleProduct();
}

function handleSaveModalData() {
  let id = document.getElementById("product-id").value;

  if (id) {
    handleUpdateProduct();
    return;
  }
  handleAddProduct();
}

function handleAddProduct() {
  let title = document.getElementById("product-title").value;
  let description = document.getElementById("product-description").value;
  let price = document.getElementById("product-price").value;
  var filesSelected = document.getElementById("product-image").files;

  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];

    var fileReader = new FileReader();

    fileReader.onload = function (fileLoadedEvent) {
      let thumbnail = fileLoadedEvent.target.result; // data: base64
      let newProduct = {
        id: productsArray.length + 1,
        title,
        description,
        price,
        thumbnail,
      };

      productsArray.push(newProduct);

      let addedProducts = localStorage.getItem("addedProducts")
        ? JSON.parse(localStorage.getItem("addedProducts"))
        : [];

      localStorage.setItem(
        "addedProducts",
        JSON.stringify([...addedProducts, newProduct])
      );

      handleProduct();
    };
    fileReader.readAsDataURL(fileToLoad);

    return;
  }
}

function handleCheck() {
  // if user hit admin/products URL this function will check the user already login ot not
  let getdata = localStorage.getItem("token"); // if already in login status then user can access this page other will redirect to signin page
  if (!getdata) {
    window.location.href = "signin.html";
  }
}

function handleLogout() {
  //handle logout button
  localStorage.removeItem("token");
  window.location.href = "index.html";
  console.log("test");
}
