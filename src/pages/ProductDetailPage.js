import Footer from "../features/common/Footer";
import Navbar from "../features/navbar/Navbar";
import ProductDetail from "../features/product/Components/ProductDetail"
function ProductDetailPage() {
    return(
        <>
            <Navbar>
                <ProductDetail></ProductDetail>
            </Navbar>
            <Footer></Footer>
            </>

    );
  

}
export default ProductDetailPage;