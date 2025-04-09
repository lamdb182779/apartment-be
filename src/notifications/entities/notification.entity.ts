import { Apartment } from "src/apartments/entities/apartment.entity";
import { Owner } from "src/owners/entities/owner.entity";
import { Receptionist } from "src/receptionists/entities/receptionist.entity";
import { Resident } from "src/residents/entities/resident.entity";
import { Check, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @OneToMany(() => NotificationRead, reads => reads.notification)
    reads: NotificationRead[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

@Check(`("ownerId" IS NOT NULL AND "residentId" IS NULL) OR ("ownerId" IS NULL AND "residentId" IS NOT NULL)`)
@Entity()
export class NotificationRead {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Notification, notification => notification.reads, { onDelete: 'CASCADE' })
    notification: Notification;

    @ManyToOne(() => Owner, owner => owner.reads, { onDelete: 'CASCADE', nullable: true })
    owner: Owner;

    @ManyToOne(() => Resident, resident => resident.reads, { onDelete: 'CASCADE', nullable: true })
    resident: Resident;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn({ nullable: true })
    readAt: Date;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

