import React from 'react';
import { motion, Variants } from 'framer-motion';
import { StickyNote } from 'lucide-react';

const EmptyNotesState = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const iconVariants: Variants = {
        initial: { rotate: 0 },
        animate: {
            rotate: [0, -10, 10, -10, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center min-h-[400px] p-8"
        >
            <motion.div
                variants={iconVariants}
                initial="initial"
                animate="animate"
                className="mb-6"
            >
                <StickyNote className="w-16 h-16 text-blue-500" />
            </motion.div>

            <motion.h3
                variants={itemVariants}
                className="text-2xl font-bold text-gray-800 mb-4 text-center"
            >
                No Notes Yet
            </motion.h3>

            <motion.p
                variants={itemVariants}
                className="text-gray-600 mb-8 text-center max-w-md"
            >
                Start capturing your thoughts and ideas. Create your first note to get started!
            </motion.p>
        </motion.div>
    );
};

export default EmptyNotesState;