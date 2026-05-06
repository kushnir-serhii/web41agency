interface ItemSlideProps {
  item: number;
  className: string;
}
export const ItemSlide: React.FC<ItemSlideProps> = ({ item, className }) => {
  return <div className={`${className}`}>{item}</div>;
};