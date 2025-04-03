import { Apartment } from "src/apartments/entities/apartment.entity";
import { Receptionist } from "src/receptionists/entities/receptionist.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: "Không có tiêu đề" })
    title: string;

    @Column({ nullable: true })
    describe: string;

    @Column("simple-json")
    content: any[];

    @ManyToOne(() => Receptionist, receptionist => receptionist.notifications, { nullable: true })
    receptionist: Receptionist

    @OneToMany(() => NotificationApartment, apartment => apartment.notification)
    apartments: NotificationApartment[];

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

@Entity()
export class NotificationApartment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Notification, notification => notification.apartments)
    notification: Notification;

    @ManyToOne(() => Apartment, apartment => apartment.notifications)
    apartment: Apartment;

    @Column({ default: false })
    isRead: boolean;

    @Column({ default: false })
    isOwnerRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
