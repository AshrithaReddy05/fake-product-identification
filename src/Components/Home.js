import React, { useState } from 'react';
import Navbar from './Navbar';

const Home = () => {
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [productId, setProductId] = useState('');
  const [manufactureDate, setManufactureDate] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [price, setPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      category,
      brand,
      productId,
      manufactureDate,
      batchNumber,
      price,
      expiryDate
    });
    setCategory('');
    setBrand('');
    setProductId('');
    setManufactureDate('');
    setBatchNumber('');
    setPrice('');
    setExpiryDate('');
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={handleSubmit}>
              <h2 className="mb-4">Product Details</h2>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select className="form-control" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select category</option>
                  <option value="medical">Medical</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="brand">Brand:</label>
                <input type="text" className="form-control" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="productId">Product ID:</label>
                <input type="text" className="form-control" id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="manufactureDate">Manufacture Date:</label>
                <input type="date" className="form-control" id="manufactureDate" value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="batchNumber">Batch Number:</label>
                <input type="text" className="form-control" id="batchNumber" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input type="number" className="form-control" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              {category === 'medical' || category === 'food' ? (
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date:</label>
                  <input type="date" className="form-control" id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </div>
              ) : null}
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
