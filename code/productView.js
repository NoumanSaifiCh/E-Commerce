(async function () {
  var baseUrl = window.location.href;
  var productId = baseUrl.substring(baseUrl.lastIndexOf("=") + 1);
  // console.log( productId)

  try {
    let getProductDetail = await fetch(
      `https://dummyjson.com/products/${productId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );
    let productDetail = await getProductDetail.json();
    console.log("productDetail", productDetail);

    document.getElementById("productThumbnail").src = productDetail.thumbnail; //Tumbnail Image map

    productDetail.images.forEach((element, i) => {
      //Maping Images
      if (i === 3) return;
      let productImageView = ` <div class="col-md-3">
        <img
          class="w-100"
          src="${element}"
          alt="Sale"
          onclick="handleImage('${element}')"
        />
      </div>`;
      document.getElementById("productImages").innerHTML += productImageView;
    });
    document.getElementById("productName").innerHTML = productDetail.title;
    document.getElementById("productCategory").innerHTML =
      productDetail.category;
    document.getElementById("productDiscount").innerHTML +=
      productDetail.discountPercentage;
    document.getElementById("productPrice").innerHTML += productDetail.price;
    document.getElementById("productDiscriptin").innerHTML =
      productDetail.description;
    document.getElementById("productBrand").innerHTML += productDetail.brand;
    document.getElementById("productRating").innerHTML += productDetail.rating;
  } catch (error) {
    console.log("Individual Product Fetch API Error", error);
  }
})();

// buy product Quantity increment //
function handleQuantity() {
  let qty = document.getElementById("product_quantity").value;
  document.getElementById("product_quantity").value = ++qty;
}

function handleImage(url) {
  document.getElementById("productThumbnail").src = url;
}
