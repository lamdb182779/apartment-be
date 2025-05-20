import { Task } from 'src/tasks/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';

@Entity()
export class Accountant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: 22, update: false })
    role: number;

    @Column({ nullable: true })
    image: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true, unique: true })
    phone: string;

    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true, select: false })
    resetCode: string;

    @ManyToMany(() => Task, task => task.accountants)
    tasks: Task[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

