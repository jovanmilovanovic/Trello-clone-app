import React, { useState, useRef, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { useBoard } from "../../context/BoardContext";
import TrashIcon from "../../assets/TrashIcon";
import { useClickOutside } from "../../hooks";
import {
    Container,
    Title,
    Input,
    EditTitleButton,
    DeleteButton
} from "./styles";
import { CardProps, NewCardProps } from "./types";
import { PropsWithChildren } from "react";

export const NewCard: React.FC<PropsWithChildren<NewCardProps>> = ({ onSuccess, onDismiss }) => {
    const [currentTitle, setCurrentTitle] = useState("")
    const ref = useRef<HTMLDivElement>(null)
    useClickOutside(ref, onDismiss)
    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = "auto"
            ref.current.style.height = ref.current.scrollHeight + "px"
        }
    }, [currentTitle])

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (currentTitle) {
                onSuccess(uuidv4(), currentTitle)
            }
        }
        if (e.key === "Escape") {
            setCurrentTitle("")
            if (typeof onDismiss === 'function') {
                onDismiss()
            }
        }
    }
    return (
        <Container>
            <Input
                autoFocus
                placeholder='Dodaj naslov za novu karticu'
                ref={ref as any}
                rows={1}
                spellCheck={false}
                value={currentTitle}
                onChange={({ target }) => setCurrentTitle(target.value)}
                onKeyDown={onKeyDown}
            />
        </Container>
    )
}

const Card: React.FC<CardProps> = ({ id, title, columnId, currentIndex }) => {
    const { updateCard, deleteCard } = useBoard()
    const [currentTitle, setCurrentTitle] = useState(title)
    const [isEditing, setIsEditing] = useState(false)
    const ref = useRef<HTMLTextAreaElement>(null)
    useClickOutside(ref, () => {
        if (isEditing) {
            setIsEditing(false)
        }
    })
    useEffect(() => {
        if (isEditing) {
            ref?.current?.focus?.()
            ref?.current?.select?.()
        }
    }, [isEditing])
    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = 'auto'
            ref.current.style.height = ref.current.scrollHeight + 'px'
        }
    }, [currentTitle])
    
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (currentTitle) {
                setIsEditing(false)
                updateCard({ id, title: currentTitle }, columnId)
            }
        }
        if (e.key === 'Escape') {
            setCurrentTitle(title)
            setIsEditing(false)
        }
    }

    return (
        <Draggable draggableId={id} index={currentIndex}>
            {(provided, snapshot) => (
                <Container
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {!isEditing && (
                        <>
                            <EditTitleButton
                                onClick={() => {
                                    setIsEditing(true)
                                }}
                            />
                            <Title>{title}</Title>
                        </>
                    )}
                    {isEditing && (
                        <Input
                            ref={ref as any}
                            rows={1}
                            value={currentTitle}
                            spellCheck={false}
                            onChange={({ target }) => setCurrentTitle(target.value)}
                            onKeyDown={onKeyDown}
                        />
                    )}
                    <DeleteButton
                        onClick={() => {
                            deleteCard(columnId, id)
                        }}
                    >
                        <TrashIcon />
                    </DeleteButton>
                </Container>
            )}
        </Draggable>
    )
}
export default Card