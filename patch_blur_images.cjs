const fs = require('fs');

const pages = [
  './src/pages/CargoService.tsx',
  './src/pages/Cars.tsx',
  './src/pages/Flights.tsx',
  './src/pages/HotelBooking.tsx',
  './src/pages/MobileMoneyService.tsx',
  './src/pages/MoneyTransfer.tsx',
  './src/pages/TravelInsurance.tsx',
  './src/pages/Visas.tsx',
  './src/pages/ServiceDetail.tsx',
  './src/pages/Shop.tsx'
];

pages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // add a slight blur overlay to the main image wrapper
    content = content.replace(
      '<div className="absolute inset-0 bg-navy/30"></div>',
      '<div className="absolute inset-0 bg-navy/40 backdrop-blur-[3px]"></div>'
    );
    
    fs.writeFileSync(file, content);
  }
});
