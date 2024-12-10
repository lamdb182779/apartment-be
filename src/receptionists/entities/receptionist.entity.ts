import { Notification } from "src/notifications/entities/notification.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Receptionist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: 21, update: false })
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

    @OneToMany(() => Notification, notification => notification.receptionist, { onDelete: "SET NULL" })
    notifications: Notification[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
