# 🏠 Property Marketplace DApp

A decentralized application (DApp) simulating a property marketplace on the Ethereum blockchain. Users can view available properties and purchase them using Ether (ETH). Ownership is transparently recorded on-chain via a smart contract.

This project is an adaptation of the Truffle Pet Shop tutorial, reimagined for real-world asset management.

---

## ✨ Features

- **View Properties**: Browse properties with full details (address, bedrooms, bathrooms, area, price).
- **Buy Property**: Purchase a property with ETH via MetaMask.
- **Decentralized Ownership**: Immutable ownership on the Ethereum blockchain.
- **Real-time Updates**: UI dynamically updates to reflect purchased properties.

---

## 🔧 Technologies Used

| Component             | Tool/Framework                |
|----------------------|-------------------------------|
| Smart Contracts       | Solidity                      |
| Blockchain Network    | Ethereum (via Ganache)        |
| Development Framework | Truffle Suite                 |
| Frontend Integration  | Web3.js, Truffle-Contract     |
| Wallet Interaction    | MetaMask                      |
| Frontend              | HTML, CSS, JS, jQuery, Bootstrap |
| Local Server          | lite-server                   |

---

## 🛠️ Installation & Environment Setup

### 1. Prerequisites

- **Node.js & npm**  
  Download from [https://nodejs.org](https://nodejs.org)  
  Verify:  
  ```bash
  node -v
  npm -v
  ```

- **Truffle Suite**  
  Install globally:
  ```bash
  npm install -g truffle
  ```
  Verify:
  ```bash
  truffle version
  ```

- **Ganache (Desktop)**  
  Download from [https://trufflesuite.com/ganache](https://trufflesuite.com/ganache)  
  Setup:
  - Launch Ganache
  - Go to ⚙️ Settings → Workspace / Server
  - Set **Network ID** or **Chain ID** to `1337`
  - Save & restart Ganache

- **MetaMask**  
  - Install extension for Chrome/Firefox
  - Create or import wallet
  - Add **Ganache Local Network**:
    ```
    Network Name: Ganache Local
    New RPC URL: http://localhost:7545
    Chain ID: 1337
    Currency Symbol: ETH
    ```

  - Import Ganache accounts (🔑 icon in Ganache) into MetaMask

---

## 📦 Project Setup

```bash
# Clone the repo
git clone https://github.com/thanushkaPraveen/property-selling.git
cd property-selling

# Install dependencies
npm install
```

---

## ▶️ Running the DApp

### 1. Start Ganache  
Make sure Ganache is running with Chain ID `1337`.

### 2. Deploy Smart Contracts

```bash
truffle migrate --reset
```

### 3. Start the Frontend Server

```bash
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser
- Connect MetaMask to **Ganache Local**
- You’re now ready to explore the DApp!

---

## 📁 Project Structure

| Path/Folder               | Description                                      |
|--------------------------|--------------------------------------------------|
| `contracts/Property.sol` | Smart contract logic for property transactions   |
| `migrations/`            | Migration scripts for Truffle                    |
| `src/index.html`         | Main HTML file for the frontend                  |
| `src/js/app.js`          | JS logic for interacting with the blockchain     |
| `src/properties.json`    | Static data for property listings                |
| `truffle-config.js`      | Truffle network and compiler settings            |
| `package.json`           | Node.js dependencies and scripts                 |

---

## 🧪 How to Use

1. **Browse Listings**  
   Properties load automatically from `properties.json`.

2. **Connect Wallet**  
   Ensure MetaMask is connected to Ganache.

3. **Purchase Property**  
   Click “Buy Property” → Confirm transaction in MetaMask.

4. **On Success**  
   The property will be marked as **Sold!** and disabled in the UI.

---

## 🚀 Future Improvements

- 💸 **Withdrawal Function**: Allow contract owner to withdraw Ether.
- 🏘️ **User Property Listing**: Let users list properties via frontend.
- 🪙 **ERC-721 Integration**: Turn properties into NFTs for unique ownership.
- 🎨 **UI Enhancements**: Add filters, loaders, better UX feedback.
- 🧾 **IPFS Integration**: Decentralized image and document storage.
- 🧪 **Testing Suite**: Truffle unit tests for the smart contract.

---

## 👨‍💻 Author

**Thanushka Wickramarachchi**  
[GitHub](https://github.com/thanushkaPraveen) | [LinkedIn](https://www.linkedin.com/in/thanushkawickramarachchi)

---

## 📜 License

MIT License — feel free to fork and expand!
