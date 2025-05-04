import data from './ImageName.json'

export const generateGame = () => {
    const dataBase = data.List;
    const randomVal = dataBase[Math.floor(Math.random() * dataBase.length)];

    return {
        img: randomVal.img,
        ans: randomVal.name
    }
}