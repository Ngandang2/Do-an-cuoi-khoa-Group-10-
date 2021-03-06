import styled from 'styled-components';
import { Green, White } from 'src/contants/cssContants';

export const LayoutSlidePoster = styled.section`
    position: relative;
    margin-right: auto;
    margin-left: auto;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export const ButonCarousel = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(17,22,31, 0.54);
    color: ${Green};
    z-index: 100;
    top: 40%;
    width: 40px;
    height: 100px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all .4s ease;

    &.show {
        opacity: 1;
        visibility: visible;
    }

    &.left {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        left: 0;
    }

    &.right {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        right: 0;
    }

    &:hover {
        background: ${Green};
        color: ${White};
    }
`;

export const LayoutSlide = styled.div`
    height: 100%;
    transition: 700ms;
    cursor: pointer;
`;

export const SlideItem = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
`;

export const Image = styled.img`
    object-fit: inherit;
`;