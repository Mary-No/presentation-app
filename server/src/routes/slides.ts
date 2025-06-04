import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../db/client';

const router = Router();

async function checkIsCreator(presentationId: string, nickname: string) {
    const userRole = await prisma.userRole.findUnique({
        where: {
            presentationId_userNickname: {
                presentationId,
                userNickname: nickname,
            },
        },
    });
    return userRole?.role === 'creator';
}

router.post('/:id', async (req, res) => {
    const { id: presentationId } = req.params;
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ error: 'Nickname is required' });
    }

    const isCreator = await checkIsCreator(presentationId, nickname);
    if (!isCreator) {
        return res.status(403).json({ error: 'Only creator can add slides' });
    }

    const currentMax = await prisma.slide.aggregate({
        where: { presentationId },
        _max: { slideIndex: true },
    });

    const nextIndex = (currentMax._max.slideIndex ?? -1) + 1;

    try {
        const slide = await prisma.slide.create({
            data: {
                id: uuidv4(),
                presentationId,
                content: '',
                slideIndex: nextIndex,
            },
        });

        res.status(201).json(slide);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add slide' });
    }
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { content, nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ error: 'Nickname is required' });
    }

    const slide = await prisma.slide.findUnique({ where: { id } });
    if (!slide) {
        return res.status(404).json({ error: 'Slide not found' });
    }

    const isCreator = await checkIsCreator(slide.presentationId, nickname);
    if (!isCreator) {
        return res.status(403).json({ error: 'Only creator can update slides' });
    }

    try {
        const updatedSlide = await prisma.slide.update({
            where: { id },
            data: { content },
        });

        res.json(updatedSlide);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update slide' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ error: 'Nickname is required' });
    }

    const slide = await prisma.slide.findUnique({ where: { id } });
    if (!slide) {
        return res.status(404).json({ error: 'Slide not found' });
    }

    const isCreator = await checkIsCreator(slide.presentationId, nickname);
    if (!isCreator) {
        return res.status(403).json({ error: 'Only creator can delete slides' });
    }

    try {
        await prisma.slide.delete({ where: { id } });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete slide' });
    }
});

export default router;