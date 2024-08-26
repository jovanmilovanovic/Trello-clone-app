import React from "react";

import { Container, IconContainer } from "./styles";

import PlusIcon from "../../assets/PlusIcon";
import { PropsWithChildren } from "react";

interface Props {
    onClick: () => void;
    isFirst: boolean;
}

const AddColumnButton: React.FC<PropsWithChildren<Props>> = ({onClick, isFirst}) => {
    console.log(onClick);
    return(
        <Container onClick={onClick}>
            <IconContainer>
                <PlusIcon/>
            </IconContainer>
                <span>{isFirst ? "Dodaj listu" : "Dodaj jos jednu listu"}</span>
        </Container>
    )
}

export default AddColumnButton