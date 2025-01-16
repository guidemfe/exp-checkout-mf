import React, { useState, useEffect } from 'react';
import PubSub from 'pubsub-js'; // Para escutar os eventos do cart
import './Checkout.css'; // Importe o arquivo CSS para estilização

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]); // Estado para os itens no carrinho

    // Inscrição no evento de atualização do carrinho
    useEffect(() => {
        const cartSubscription = PubSub.subscribe('cartUpdated', (msg, data) => {
            setCartItems(data); // Atualiza os itens do carrinho com os dados recebidos
        });

        // Limpeza ao desmontar o componente
        return () => {
            PubSub.unsubscribe(cartSubscription);
        };
    }, []);

    const user = {
        email: 'john.doe@example.com',
        phone: '123-456-7890',
    };
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className='checkout-container'>
            <section className='checkout-section checkout-info'>
                <h1>Checkout</h1>
                <hr />
                <h2>Contact information</h2>
                <form>
                    <label>
                        Email
                        <input type='email' name='email' value={user.email} readOnly />
                    </label>
                    <label>
                        Phone
                        <input type='tel' name='phone' value={user.phone} readOnly />
                    </label>
                </form>
                <button>Save</button>
            </section>
            <section className='checkout-section checkout-payment'>
                <h2>Payment</h2>
                <p>All transactions are secure and encrypted.</p>
                <div className='payment-methods'>
                    <label>
                        <input type='radio' name='payment-method' value='credit_card' onChange={handlePaymentMethodChange} />
                        Credit card
                    </label>
                    <label>
                        <input type='radio' name='payment-method' value='paypal' onChange={handlePaymentMethodChange} />
                        PayPal
                    </label>
                    <label>
                        <input type='radio' name='payment-method' value='stripe' onChange={handlePaymentMethodChange} />
                        Stripe
                    </label>
                </div>
            </section>
            <section className='checkout-section checkout-cart'>
                <h2>Shopping Cart</h2>
                {cartItems.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Your cart is empty.</p>
                )}
                <p>Total: {calculateTotal()}</p>
            </section>
        </div>
    );
};

export default Checkout;
