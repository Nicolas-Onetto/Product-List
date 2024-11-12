import { React, useState, useEffect, useRef } from "react";
import imgdata from "./../assets/data.json";
import carrittoadd from "./../../public/images/icon-add-to-cart.svg";
import carritodecremento from "./../../public/images/icon-decrement-quantity.svg";
import carritincremento from "./../../public/images/icon-increment-quantity.svg";
import illustration from "./../../public/images/illustration-empty-cart.svg";
import remove from "./../../public/images/icon-remove-item.svg";
import neutral from "./../../public/images/icon-carbon-neutral.svg";
import check from "./../../public/images/icon-order-confirmed.svg"

function ContainerImg() {
    // Estados
    let [windows, setwindow] = useState(window.innerWidth);
    let [height, setheight] = useState(window.innerHeight);
    let [data, setdata] = useState(imgdata);
    let [order, setorder] = useState([]);
    let [total, settotal] = useState(0);
    let count = useRef([]);
    let add = useRef([]);
    let [confirm, setconfirm] = useState();
    let [flag, setflag] = useState(false);
    let modclassorder = useRef(null)
    let contentfront = useRef(null)

    // Efecto para manejar el tamaño de la ventana
    useEffect(() => {
        const handleResize = () => {setwindow(window.innerWidth); setheight(window.innerHeight); console.log("height: "+height); console.log("widght: "+windows)};
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Efecto para actualizar el total cuando cambia el carrito
    useEffect(() => {
        const newTotal = order.reduce((acc, item) => {
            let product = data.find(prod => prod.name === item.name);
            return acc + (product ? product.price * item.counts : 0);
        }, 0);
        settotal(newTotal);
    }, [order, data]);

    useEffect(()=>{
        console.log(confirm)
    },[confirm])

    // Función para incrementar y decrementar la cantidad de un producto
    function Carrito(index, newcount, value) {
        if (data[index].counts >= 0) {
            ModCount(newcount, index);
            Agregarproducto(newcount, value);
        }
    }

    // Modificar la cantidad de un producto en el estado 'data'
    function ModCount(newcount, index) {
        let update = data.map((value, i) => {
            if (i === index && newcount >= 0) {
                return { ...value, counts: newcount };
            }
            return value;
        });
        setdata(update);
    }

    function Agregarproducto(newcount, value) {
        let is = order.findIndex(item => item.name === value.name);
        if (is >= 0) {
            setorder(item => item.map((el, i) =>
                i === is ? { ...el, counts: newcount } : el
            ));
        } else {
            setorder(item => [...item, { "name": value.name, "counts": newcount }]);
        }
    }

    // Remover todo la cantidad de producto
    function Remove(index) {
        let neworder = [...order];
        let indata = data.findIndex(item => item.name === order[index].name);
        data[indata].counts = 0;
        neworder.splice(index, 1);
        setorder(neworder);
    }

    // Mostrar imagen según tamaño de pantalla
    function Showimg(value, i) {
        let img;
        if (windows <= 768) {
            img = value.image.mobile;
        } else if (windows <= 1366) {
            img = value.image.tablet;
        } else {
            img = value.image.desktop;
        }
        return <img key={i} className="img-data img-order-confirm" src={img} alt={value.name} />;
    }

    function Hover(bol, index){
        
        if(bol){
            count.current[index].classList.add("show")
            add.current[index].classList.add("ocultar")
        }else{
            count.current[index].classList.remove("show")
            add.current[index].classList.remove("ocultar")
        }
    }

    // Mostrar los productos disponibles
    function Showdata() {
        return data.map((value, i) => (
            <div key={i} id="front-img">
                <div id={value.name} className="container-shop">
                    <div className="container-img">
                        {Showimg(value, i)}
                    </div>
                    <div className="box-shop-data">
                        <div className="container-shop-data" >
                            <div className="container-shop-data-add" onMouseEnter={()=>Hover(true, i)} onMouseLeave={()=>Hover(false, i)} ref={item => add.current[i] = item}>
                                <img src={carrittoadd} alt="Add to cart" className="carrito"/>
                                <h3 id="add-cart">Add to cart</h3>
                            </div>
                            <div className="container-shop-data-count" ref={item => {count.current[i] = item}} onMouseEnter={()=>Hover(true, i)} onMouseLeave={()=>Hover(false, i)}>
                                <button className="box-decrement" onClick={() => Carrito(i, value.counts - 1, value)} >
                                    <img src={carritodecremento} alt="Decrement"  className="decrement"/>
                                </button>
                                <h3 className="count">{value.counts}</h3>
                                <button className="box-increment" onClick={() => Carrito(i, value.counts + 1, value)} >
                                    <img src={carritincremento} alt="Increment"  className="increment"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-data">
                    <h5>{value.category}</h5>
                    <h4>{value.name}</h4>
                    <h4>${value.price.toFixed(2)}</h4>
                </div>
            </div>
        ));
    }



    // Mostrar la lista de productos en el carrito
    function Showlist() {
        if (order.some(item => item.counts > 0)) {
            return (
                <>
                    {
                        order.map((value, i) => {
                            let index = data.findIndex(item => item.name === value.name);
                            if (value.counts > 0) {
                                let precio = value.counts * data[index].price;
                                return (
                                    <div key={i} id="" className="conteiner-producto">
                                        <div className="content-data">
                                            <div id="" className="container-name-producto">
                                                <h1 className="name-product">{value.name}</h1>
                                            </div>
                                            <div className="conteiner-data-producto">
                                                <h4>{value.counts}x</h4>
                                                <br/>
                                                <h4>@ ${data[index].price}</h4>
                                                <h4>${precio}</h4>
                                            </div>
                                        </div>
                                        <div className="conteiner-remove-product" onClick={() => Remove(i)}>
                                            <img className="remove-product" src={remove}/>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    }
                    <div className="conteiner-total">
                        <div className="" id="order-total">
                            <h3 id="total">Order Total:</h3> 
                            <h3 id="total-order">${total.toFixed(2)}</h3>
                        </div>
                        <button id="confirm-order-button" className="confirm-order-button" onClick={()=>{setconfirm(order), ShowListConfirm()}}>Confirm Order</button>
                        <div className="box-neutral" id="carbon">
                            <img src={neutral} alt="Neutral" />
                            <h6>This is a <b>carbon-neutral</b> delivery</h6>
                        </div>    
                    </div>
                </>
            );
        } else {
            return (<img id="illustration" src={illustration} alt="Empty cart" />);
        }
    }

    //Muestra la lista ("sin poder ser modificable") para confirmar pedido
    function Confirm(){
        if(confirm){ return(
            <>
                <div className="box-img-check">
                    <img id="check" src={check} alt="check" />
                </div>
                <div className="box-title-check">
                    <h1 id="title-order">Order Confirmed</h1>
                    <p id="text-order">We hope you enjoy you food!</p>
                </div>
                {confirm.map((value, i)=>{
                        let index = data.findIndex(item=>item.name===value.name);
                        let count = data[index].counts;
                        return (<div className="container-order-confirm" key={i}>
                                    <div className="box-container-img-product-total">
                                        {Showimg(data[index], i)}
                                    </div>
                                    
                                    <div className="order-confirm-data">
                                        <h4>{value.name}</h4>
                                        <div className="order-data-confirm">
                                            <h5>{data[index].counts}x</h5>
                                            <h5>@ ${count}</h5>
                                        </div>
                                    </div>
                                    <div className="total-product">
                                        <h3 className="total-product-text">${(count*data[index].price).toFixed(2)}</h3>
                                    </div>
                        </div>)})}
                {
                    <>
                        <div id="conteiner-order-total-confirm">
                            <div className="order-total-confirm">
                                <h2 className="order-total-confirm-data">Order Total:</h2>
                                <h2 className="order-total-confirm-data">${total.toFixed(2)}</h2>
                            </div>
                            
                        </div>
                        <div className="conteiner-start-new">
                        <button id="enviar" className="confirm-order-button" onClick={()=>{setorder([]); setconfirm(null); data.map(value=> value.counts = 0); ShowListConfirm()}}>Start New Order</button>
                        </div>
                        
                    </>
                    
                }
            </>)} else return null
            
    }

    //Agrega o saca el className del contenedor de .order-confirm
    function ShowListConfirm(){
        setflag(!flag);

        if(flag){
            modclassorder.current.classList.remove("show-container-order-confirm");
            modclassorder.current.classList.add("no-show-container-order-confirm");
        } else{
            modclassorder.current.classList.remove("no-show-container-order-confirm");
            modclassorder.current.classList.add("show-container-order-confirm");
        }
        console.log(modclassorder.current.classList)
    }
    
    return (
            <div id="container-front" ref={contentfront}>
                <div id="front">
                    <div id="title-box">
                        <h1 id="title">Desserts</h1>
                    </div>
                    <div id="box-img">
                        {Showdata()}    
                    </div>
                </div>
                <div className="content-order">
                    <div id="orders">
                        <h2 id="cart">Your Cart ({order.filter(item => item.counts > 0).length})</h2>
                        {Showlist()}
                    </div>  
                </div>
                <div className="no-show-container-order-confirm" ref={modclassorder}>
                    <div className="order-confirm">
                        {Confirm()}
                    </div>
                </div>
            </div>
    );
}

export default ContainerImg;
