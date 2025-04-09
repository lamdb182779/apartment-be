import { Apartment } from 'src/apartments/entities/apartment.entity';
import { NotificationRead } from 'src/notifications/entities/notification.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Owner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: 31, update: false })
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

    @Column({ default: false })
    isVerify: boolean;

    @Column({ nullable: true })
    verifyId: string;

    @Column({ nullable: true })
    expiredAt: Date;

    @OneToMany(() => Apartment, apartment => apartment.owner, { onDelete: "SET NULL" })
    apartments: Apartment[]

    @OneToMany(() => NotificationRead, reads => reads.owner)
    reads: NotificationRead[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
