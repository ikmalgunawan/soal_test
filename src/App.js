import React, { useState } from 'react';

function App() {
  // Set harga mobil avanza
  const [price, setPrice] = useState(240000000);
  // Set DP 20%
  const [downPayment, setDownPayment] = useState(20);
  // Set periode 1.5 tahun
  const [loanPeriod, setLoanPeriod] = useState(1.5);
  // Set bunga 14%
  const [interestRate, setInterestRate] = useState(14);
  // Set angsuran bulanan
  const [monthlyInstallment, setMonthlyInstallment] = useState(null);
  // Set jadwal pembayaran
  const [schedule, setSchedule] = useState([]);

  const handleCalculate = () => {
    const dp = (downPayment / 100) * price; // Uang Muka
    const loanAmount = price - dp; // Jumlah Pinjaman
    const months = loanPeriod * 12; // Tenor dalam bulan   

    // Hitung total bunga
    const totalInterest = (loanAmount * (interestRate / 100) * loanPeriod);

    // Hitung total jumlah yang harus dibayar (pinjaman + total bunga)
    const totalLoanWithInterest = loanAmount + totalInterest;

    // Hitung angsuran per bulan & pembulatan
    const installment = Math.round((totalLoanWithInterest / months) / 1000) * 1000; // Pembulatan ke ribuan

    setMonthlyInstallment(installment);

    // Generate payment schedule
    const scheduleData = [];
    const contractNo = 'AGR00001';
    let currentDate = new Date(2024, 0, 25); // Mulai dari Januari 2024

    for (let i = 1; i <= months; i++) {
      const paymentDate = new Date(currentDate);
      paymentDate.setMonth(currentDate.getMonth() + i - 1); // Tambahkan 1 bulan setiap iterasi
      const formattedDate = paymentDate.toISOString().split('T')[0]; // Format tanggal jadi yyyy-mm-dd

      scheduleData.push({
        kontrakNo: contractNo,
        angsuranKe: i,
        angsuranPerBulan: installment,
        tanggalJatuhTempo: formattedDate,
      });
    }

    setSchedule(scheduleData);
  };

  // Fungsi untuk mengatur ulang semua nilai ke kondisi awal
  const handleRefresh = () => {
    setPrice(240000000);
    setDownPayment(20);
    setLoanPeriod(1.5);
    setInterestRate(14);
    setMonthlyInstallment(null);
    setSchedule([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '550px', margin: 'auto' }}>
      <h1>Calculator IMS Finance</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <label>Harga Mobil (IDR):</label>
        <input
          type="text"
          value={price || ''}
          onChange={(e) => setPrice(Number(e.target.value.replace(/,/g, '')))}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <label>DP (%):</label>
        <input
          type="text"
          value={downPayment || ''}
          onChange={(e) => setDownPayment(e.target.value ? Number(e.target.value) : 0)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <label>Periode Angsuran (Tahun):</label>
        <input
          type="text"
          value={loanPeriod || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value) || value === '') {
              setLoanPeriod(value ? parseFloat(value) : 0);
            }
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <label>Bunga (% per tahun):</label>
        <input
          type="text"
          value={interestRate || ''}
          onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : 0)}
        />
      </div>
      <button onClick={handleCalculate} style={{ marginTop: '20px', marginRight: '10px' }}>
        Calculate
      </button>
      <button onClick={handleRefresh} style={{ marginTop: '20px' }}>
        Refresh
      </button>

      {monthlyInstallment !== null && (
        <div style={{ marginTop: '20px' }}>
          <h2>Angsuran Bulanan</h2>
          <p>{monthlyInstallment.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
        </div>
      )}

      {schedule.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Jadwal Angsuran</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>KONTRAK_NO</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>ANGSURAN_KE</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>ANGSURAN_PER BULAN</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>TANGGAL JATUH TEMPO</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.kontrakNo}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.angsuranKe}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {item.angsuranPerBulan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.tanggalJatuhTempo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
