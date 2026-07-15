export const formatPrice = (amount) => {
  return `UGX ${Number(amount).toLocaleString('en-UG')}`;
};
